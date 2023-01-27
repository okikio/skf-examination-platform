export default {
  "$schema": "./node_modules/rascal/lib/config/schema.json",
  "vhosts": {
    "/": {
      "connection": {
        // user:password@broker.example.com
        "url": "amqp://localhost:5672/"
      },
      "exchanges": ["demo_ex"],
      "queues": ["demo_q"],
      "bindings": ["demo_ex[a.b.c] -> demo_q"],
      "publications": {
        "demo_pub": {
          "exchange": "demo_ex",
          "routingKey": "a.b.c"
        }
      },
      "subscriptions": {
        "demo_sub": {
          "queue": "demo_q",
          "prefetch": 3
        }
      }
    }
  }
}