import type { BrokerConfig } from "https://esm.sh/rascal@16.2.0";

export const RABBIT_MQ_CONN_STRING = Deno.env.get("RABBIT_MQ_CONN_STRING") || 'localhost';
export const RABBITMQ_DEFAULT_USER = Deno.env.get("RABBITMQ_DEFAULT_USER") || 'guest';
export const RABBITMQ_DEFAULT_PASS = Deno.env.get("RABBITMQ_DEFAULT_PASS") || 'guest';

export const config: BrokerConfig = {
  // "$schema": "./node_modules/rascal/lib/config/schema.json",
  "vhosts": {
    "/": {
      "connection": {
        // user:password@broker.example.com
        // "url": `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBIT_MQ_CONN_STRING}:5672/`,

        "hostname": RABBIT_MQ_CONN_STRING,
        "port": 5672,
        "user": RABBITMQ_DEFAULT_USER,
        "password": RABBITMQ_DEFAULT_PASS,
      },
      "exchanges": [
        {
          "name": "deployment_exchange",
          "type": "direct",
          "options": {
            "durable": true
          }
        }
      ],
      "queues": [
        {
          "name": "deployment_queue",
          "options": {
            "durable": true
          }
        }
      ],
      "bindings": ["deployment_exchange -> deployment_queue"],
      "publications": {
        "deployment_publish": {
          "exchange": "deployment_exchange",
          "routingKey": "a.b.c"
        }
      },
      "subscriptions": {
        "deployment_subscription": {
          "queue": "deployment_queue",
          "prefetch": 3
        }
      }
    }
  }
}

export default config;

/**
  
  callback: async (message: any) => {
    try {
      const k8sApi = new CoreV1Api("https://kubernetes.default.svc");
      const namespace = "default";
      const body = {
        apiVersion: "v1",
        kind: "Pod",
        metadata: {
          name: `my-pod-${Date.now()}`
        },
        spec: {
          containers: [
            {
              name: "my-container",
              image: "nginx:latest"
            }
          ]
        }
      };
      await k8sApi.createNamespacedPod(namespace, body);
      console.log(`Pod created: ${body.metadata.name}`);
    } catch (err) {
      console.error(err);
    }
  }

 */
