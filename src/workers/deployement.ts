import { BrokerAsPromised as Broker } from 'rascal';

const Broker = require('rascal').BrokerAsPromised;
const config = require('./config');


(async () => {
  try {
    const broker = await Broker.create(config);
    broker.on('error', console.error);

    // Publish a message
    const publication = await broker.publish('demo_publication', 'Hello World!');
    publication.on('error', console.error);

    // Consume a message
    const subscription = await broker.subscribe('demo_subscription');
    subscription
      .on('message', (message, content, ackOrNack) => {
        console.log(content);
        ackOrNack();
      })
      .on('error', console.error);
  } catch (err) {
    console.error(err);
  }
})();