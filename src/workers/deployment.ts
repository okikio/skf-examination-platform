import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

import { config } from './config.ts';

// @deno-types="npm:@types/rascal"
import rascal from 'rascal';
const { createBrokerAsPromised } = rascal;

try {
  const broker = await createBrokerAsPromised(config);
  broker.on('error', console.error);

  // Publish a message
  for (let i = 0; i < 10; i++) {
    const publication = await broker.publish('deployment_publish', 'Hello World!');
    publication.on('error', console.error);

    console.count('publish');
    
    await delay(10);
  }

  // Consume a message
  const subscription = await broker.subscribe('deployment_subscription');
  subscription
    .on('message', (message, content, ackOrNack) => {
      console.log([message, content]);
      ackOrNack();
    })
    .on('error', console.error);
} catch (err) {
  console.error(err);
}