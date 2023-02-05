import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config';
import { nanoid } from "nanoid";

import type { Message } from 'amqplib';
import rascal, { type AckOrNack } from 'rascal';

import type { Database } from '@/db/database.types';
const { createBrokerAsPromised } = rascal;

type SupabaseClientType = SupabaseClient<Database, "public">;
export async function getAuth(supabase: SupabaseClientType) { 
  const { data, error } = await supabase.auth.getSession();

  const { access_token, refresh_token } = data?.session ?? {};
  if (!access_token || !refresh_token) {
    throw new Error("Missing access_token or refresh_token");
  }

  if (error) throw error; 
  return data;
}

export async function deployLabs(supabase: SupabaseClientType, instanceId: number, userId: string) {
  await getAuth(supabase);

  const labs = supabase.from("lab_items").select("*");
  const { error, data } = await labs.eq('id', instanceId);
  if (error) throw error;

  const [lab] = data;

  const correlationId = nanoid();

  const broker = await createBrokerAsPromised(config);
  const subscription = await broker.subscribe('deployment_subscription');
  broker.on('error', console.error);

  // Publish a message
  const body = lab.image_tag + ":" + String(userId);
  const publication = await broker.publish('deployment_publish', String(body), {
    options: {
      correlationId,
      replyTo: 'deployment_queue'
    }
  });
  /**
    , {
      routingKey: 'a.b.c',
      options: {
        correlationId,
        replyTo: 'deployment_subscription'
      }
    }
   */
  publication.on('error', console.error);

  console.log({
    body: String(body)
  })

  // return { body }

  // Consume a message
  let onMessage: (message: Message, content: any, ackOrNackFn: AckOrNack) => void = () => { };
  const result = await new Promise<typeof body>(resolve => {
    subscription
      .on('message', (message, content: typeof body, ackOrNack) => {
        const props = message.properties;
        if (correlationId == props.correlationId) {
          console.log([message, content]);
          resolve(content);
        }
        ackOrNack();
      })
      .on('error', console.error);
  });

  subscription.off('message', onMessage)
  subscription.off('error', console.error)
  return result;
}

export function emailUserName(email?: string) { 
  if (!email) return "skf-lab";

  // TODO: Might have to add an email prefix, just in case a person's email starts w/ a number
  const match = /(.*)+@(?:.*)+/.exec(email);

  if (match) { 
    const [_, usersName] = match;
    // Remove symbols
    return usersName.toLowerCase().replace(/[^a-z0-9]/, "");
  }
}

export function alphaNumeric(value: string) {
  const match = value.match(/[^ \w_\.\-\\|\\'\",\+\(\)\/\:@\?\&\=\%\!\#\^\;]/g);
  if (match) {
    throw new Error("Validation Error. User Name & Id supplied not an a-z A-Z 0-9 _ . , - / ! # ^ & + ' \" value. Basically, you're using special values no allowed on SKF, e.g. emoji, etc..., that aren't common aplha numeric symbols normally used.");
  } 

  return true;
}

export function isInteger(value: number) { 
  if (!Number.isInteger(value)) {
    throw new Error("Validation Error. Instance id supplied is not an integer.")
  } 

  return true;
}