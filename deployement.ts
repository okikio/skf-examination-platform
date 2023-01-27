import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

import rascal from 'npm:rascal';
import config from './config.ts';

const { BrokerAsPromised: Broker } = rascal;

// console.log([Broker])

try {
  const broker = await Broker.create(config);
  broker.on('error', console.error);

  // Publish a message
  for (let i = 0; i < 100; i++) {
    const publication = await broker.publish('demo_pub', 'Hello World!');
    publication.on('error', console.error);

    console.count('publish');
    
    await delay(100);
  }

  // Consume a message
  const subscription = await broker.subscribe('demo_sub');
  subscription
    .on('message', (message: any, content: any, ackOrNack: () => void) => {
      console.log(content);
      ackOrNack();
    })
    .on('error', console.error);
} catch (err) {
  console.error(err);
}