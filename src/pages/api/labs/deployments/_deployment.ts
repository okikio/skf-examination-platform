import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/workers/config';

import { nanoid } from "nanoid/async";

import rascal from 'rascal';
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

  const broker = await createBrokerAsPromised(config);
  broker.on('error', console.error);

  const correlationId = await nanoid();
  const subscription = await broker.subscribe('deployment_subscription');

  const body = lab.image_tag + ":" + String(userId);

  // Publish a message
  const publication = await broker.publish('deployment_publish', String(body), {
    routingKey: 'deployment_queue',
    options: {
      correlationId,
      replyTo: 'deployment_subscription'
    }
  });
  publication.on('error', console.error);

  // Consume a message
  return await new Promise<typeof body>(resolve => {
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
  })
}