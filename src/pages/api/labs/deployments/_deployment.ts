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

export async function deployLabs(supabase: SupabaseClientType, instanceId: number, userId: string | number) {
  await getAuth(supabase);

  const labs = supabase.from("lab_items").select("*");
  const { error, data } = await labs.eq('id', instanceId);
  if (error) throw error;

  const [lab] = data;

  const broker = await createBrokerAsPromised(config);
  broker.on('error', console.error);

  const correlationId = await nanoid();
  const subscription = await broker.subscribe('deployment_subscription');

  const body = lab.image_tag + ":" + str(userid)

  // Publish a message
  const publication = await broker.publish('deployment_publish', String(response), {
    routingKey: 'deployment_queue',
    options: {
      correlationId,
      replyTo: 'deployment_subscription'
    }
  });
  publication.on('error', console.error);
  // self.corr_id = str(uuid.uuid4())
  // self.channel.basic_publish(
  //   exchange = '',
  //   routing_key = 'deployment_qeue',
  //   properties = pika.BasicProperties(
  //     reply_to = self.callback_queue,
  //     correlation_id = self.corr_id,
  //   ),
  //   body = n)

  // Consume a message
  return await new Promise(resolve => {
    subscription
      .on('message', (message, content, ackOrNack) => {
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