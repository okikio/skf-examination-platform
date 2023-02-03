import type { BrokerConfig } from "rascal";
import process from "node:process";

// const creds = { username: "admin", password: "admin-skf-secret" };
export const RABBIT_MQ_CONN_STRING = process?.env?.["RABBIT_MQ_CONN_STRING"] || 'localhost';
export const RABBITMQ_DEFAULT_USER = process?.env?.["RABBITMQ_DEFAULT_USER"] || 'guest';
export const RABBITMQ_DEFAULT_PASS = process?.env?.["RABBITMQ_DEFAULT_PASS"] || 'guest';

export const config: BrokerConfig = {
  "vhosts": {
    "/": {
      "connection": {
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
          "exchange": "deployment_exchange"
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