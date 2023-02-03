import { autoDetectClient, Reflector } from 'https://deno.land/x/kubernetes_client@v0.3.2/mod.ts';
import {
  CoreV1Api,
  fromService, toService,
  fromServicePort, toServicePort,
  fromNamespace, toNamespace,
} from "https://deno.land/x/kubernetes_apis@v0.3.2/builtin/core@v1/mod.ts";
import { fromObjectMeta, toObjectMeta } from 'https://deno.land/x/kubernetes_apis@v0.3.2/builtin/meta@v1/structs.ts';
import {
  NetworkingV1Api,
  fromIngressSpec, toIngressSpec,
  fromIngress, toIngress,
  fromIngressRule, toIngressRule,
  fromHTTPIngressRuleValue, toHTTPIngressRuleValue,
  fromHTTPIngressPath, toHTTPIngressPath,
  fromIngressBackend, toIngressBackend,
  fromIngressServiceBackend, toIngressServiceBackend,
  fromServiceBackendPort, toServiceBackendPort
} from "https://deno.land/x/kubernetes_apis@v0.3.2/builtin/networking.k8s.io@v1/mod.ts";
import {
  fromPodSpec, toPodSpec,
  fromPodTemplateSpec, toPodTemplateSpec,
  fromContainer, toContainer,
  fromContainerPort, toContainerPort,
  type Service
} from 'https://deno.land/x/kubernetes_apis@v0.3.2/builtin/core@v1/structs.ts';
import {
  type Deployment,
  AppsV1Api,
  fromDeploymentSpec, toDeploymentSpec,
  fromDeployment, toDeployment
} from 'https://deno.land/x/kubernetes_apis@v0.3.2/builtin/apps@v1/mod.ts';

import { config } from './config.ts';

// @deno-types="npm:@types/rascal"
import rascal from 'rascal';
const { createBrokerAsPromised } = rascal;

const kubernetes = await autoDetectClient();
const coreApi = new CoreV1Api(kubernetes);

let labs_protocol: string | undefined;
let labs_domain = Deno.env.get("SKF_LABS_DOMAIN") ?? "";

const subdomain_deploy = Deno.env.get("SKF_LABS_DEPLOY_MODE") === "subdomain";
if (subdomain_deploy) {
  [labs_protocol, labs_domain] = /(.*:\/\/)?(.*)/.exec(labs_domain) ?? [];
  if (!labs_protocol) {
    labs_protocol = "http://";
  }
  console.log( `Subdomain deploy using ${labs_protocol}<lab>.${labs_domain},`);
} else {
  console.log(`Port deploy using ${labs_domain}:<port>`);
}

export async function createServiceForDeployment(deployment: string, user_id: string) {
  const randomPort = 40000 + (Math.random() * (60000 - 40000));
  const service = toService(
    fromService({
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: deployment
      },
      spec: {
        type: "NodePort",
        selector: {
          app: deployment
        },
        ports: [
          toServicePort(
            fromServicePort({
              protocol: "TCP",
              port: randomPort,
              targetPort: 5000
            })
          ),
        ]
      }
    })
  );

  const response = coreApi.namespace(user_id);
  await response.createService(service);
  return randomPort;
}

export async function createUserNamespace(user_id: string) {
  try {
    const api_instance = new CoreV1Api(kubernetes);
    const body = toNamespace(
      fromNamespace({
        metadata: toObjectMeta(
          fromObjectMeta({
            name: user_id
          })
        )
      })
    );

    await api_instance.createNamespace(body);
  } catch (e) {
    throw new Error('Failed to deploy, error namespace creation!', {
      cause: e
    })
  }
}


export function createDeploymentObject(deployment: string) {
  try {
    // Configureate Pod template container
    const container = toContainer(
      fromContainer({
        name: deployment,
        image: "blabla1337/owasp-skf-lab:" + deployment,
        ports: [
          toContainerPort(
            fromContainerPort({
              containerPort: 5000
            })
          )
        ],
      })
    );

    // Create and configurate a spec section
    const template = toPodTemplateSpec(
      fromPodTemplateSpec({
        metadata: toObjectMeta(
          fromObjectMeta({
            labels: { "app": deployment }
          })
        ),
        spec: toPodSpec(
          fromPodSpec({
            containers: [container]
          })
        )
      })
    );

    // Create the specification of deployment
    const spec = toDeploymentSpec(
      fromDeploymentSpec({
        replicas: 1,
        template,
        selector: {
          'matchLabels': { 'app': deployment }
        }
      })
    );

    // Instantiate the deployment object
    const deploymentObj = toDeployment(
      fromDeployment({
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: toObjectMeta(
          fromObjectMeta({
            name: deployment
          })
        ),
        spec: spec,
      })
    );

    return deploymentObj;
  } catch (e) {
    throw new Error('Failed to deploy, error creation deployment object!', {
      cause: e
    })
  }
}

export async function createDeployment(deployment: Deployment, user_id: string) {
  try {
    const k8s_apps_v1 = new AppsV1Api(kubernetes);
    const response = await k8s_apps_v1.namespace(user_id).createDeployment(deployment);
    return response
  } catch (e) {
    throw new Error('Failed to deploy, error creation deployment object!', {
      cause: e
    })
  }
}


export async function getServiceExposedIP(deployment: string, user_id: string) {
  try {
    const api_instance = new CoreV1Api(kubernetes);
    return await api_instance.namespace(user_id).getService(deployment);
  } catch (e) {
    throw new Error('Failed to deploy, error namespace creation!', {
      cause: e
    })
  }
}

export async function getHostPortFromResponse(response: Service) {
  try {
    let node_port = -1;
    const servicePorts = response.spec?.ports ?? [];
    for (const service of servicePorts) {
      if (service.nodePort)
        node_port = service.nodePort;
    }

    // const res = labs_domain + ":" + node_port?.toString();
    return node_port;
  } catch (e) {
    throw new Error('Failed to deploy, error no host or port!', {
      cause: e
    })
  }
}


export async function createIngress(networking_v1_api: NetworkingV1Api, hostname: string, deployment: string, service_port: number, user_id: string) {
  try {
    const body = toIngress(
      fromIngress({
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: toObjectMeta(
          fromObjectMeta({
            name: `ingress-${deployment}`,
            annotations: {
              "kubernetes.io/ingress.class": "nginx",
            }
          })
        ),
        spec: toIngressSpec(
          fromIngressSpec({
            rules: [
              toIngressRule(
                fromIngressRule({
                  host: hostname,
                  http: toHTTPIngressRuleValue(
                    fromHTTPIngressRuleValue({
                      paths: [
                        toHTTPIngressPath(
                          fromHTTPIngressPath({
                            path: "/",
                            pathType: "Prefix",
                            backend: toIngressBackend(
                              fromIngressBackend({
                                service: toIngressServiceBackend(
                                  fromIngressServiceBackend({
                                    name: deployment,
                                    port: toServiceBackendPort(
                                      fromServiceBackendPort({
                                        number: service_port
                                      })
                                    )
                                  })
                                )
                              })
                            )
                          })
                        )
                      ]
                    })
                  )
                })
              )
            ]
          })
        )
      })
    );

    // Creation of the Deployment in specified namespace
    // (Can replace "default" with a namespace you may have created)
    await networking_v1_api.namespace(user_id).createIngress(body);
    return null

    // This code creates a new deployment, and adds it to the
    // deployments list.
    // const new_deployment = networking_v1_api. (
    //   fromDeploymentSpec({ name: deployment })
    // );
    // self.deployments.append(new_deployment)
    // const body = client.V1Ingress(
    //     api_version="networking.k8s.io/v1",
    //     kind="Ingress",
    //     metadata=client.V1ObjectMeta(name="ingress-"+deployment, annotations={
    //         "kubernetes.io/ingress.class": "nginx",
    //     }),
    //     spec=client.V1IngressSpec(
    //         rules=[client.V1IngressRule(
    //             host=hostname,
    //             http=client.V1HTTPIngressRuleValue(
    //                 paths=[client.V1HTTPIngressPath(
    //                     path="/",
    //                     path_type="Prefix",
    //                     backend=client.V1IngressBackend(
    //                         service=client.V1IngressServiceBackend(
    //                         port=client.V1ServiceBackendPort(
    //                             number=service_port,
    //                         ),
    //       # This code creates a new deployment, and adds it to the
    //       # deployments list.
    //       new_deployment = Deployment(name=deployment)
    //       self.deployments.append(new_deployment)

    //                         name=deployment)
    //                     )
    //                 )]
    //             )
    //         )]
    //     )
    // )
    // # Creation of the Deployment in specified namespace
    // # (Can replace "default" with a namespace you may have created)
    // networking_v1_api.create_namespaced_ingress(
    //     namespace=user_id,
    //     body=body
    // )
    // return None
  } catch (e) {
    console.error('Error creating ingress:', e)
    throw new Error('Failed to create ingress!', {
      cause: e
    })
  }
}

export function split(body: string) {
  return body.split(':');
}


export async function waitGetCompletedPodPhase(release: string, user_id: string) {
  const api_instance = new CoreV1Api(kubernetes).namespace(user_id);
  const podWatcher = new Reflector(
    opts => api_instance.getPodList(opts),
    opts => api_instance.watchPodList(opts)
  );

  podWatcher.run();

  function getPodPhase() {
    for (const pod of podWatcher.listCached()) {
      const resource_name = pod.metadata.name;
      if (resource_name.includes(release)) {
        const podPhase = pod.status?.phase;

        if (podPhase === "Running") {
          podWatcher.stop();
          return podPhase;
        }
      }
    }
  }

  return await podWatcher.goObserveAll(async iter => {
    console.log('observing...');
    let inSync = false;
    for await (const evt of iter) {
      switch (evt.type) {
        case 'SYNCED': {
          const podPhase = getPodPhase(); // sneak in rising-edge run
          if (podPhase === "Running")
            return podPhase;
          inSync = true; // start allowing falling-edge runs
          break;
        }
        case 'DESYNCED':
          inSync = false; // block runs during resync inconsistencies
          break;
        case 'ADDED':
        case 'MODIFIED':
        case 'DELETED':
          if (inSync) {
            const podPhase = getPodPhase();
            if (podPhase === "Running")
              return podPhase;
          }
          break;
      }
    }
    console.log('observer done');
  });
}

export async function deployContainer(rpc_body: string) {
  const user_id = split(rpc_body)[1];
  const deployment = split(rpc_body)[1];
  await createUserNamespace(user_id);

  const deployment_object = createDeploymentObject(deployment)
  await createDeployment(deployment_object as Deployment, user_id)

  let service_port = -1;
  try {
    service_port = await createServiceForDeployment(deployment, user_id)
  } catch (_e) {
    const api = new CoreV1Api(kubernetes);
    const response = await api.namespace(user_id).getServiceList();
    for (const i of response.items) {
      if (i?.metadata?.name == deployment) {
        service_port = await getHostPortFromResponse(i)
      }
    }
  }

  if (subdomain_deploy) {
    const hostname = `${deployment}-${user_id}.${labs_domain}`
    const networking_v1_api = new NetworkingV1Api(kubernetes);

    try {
      const ingress_err = await createIngress(networking_v1_api, hostname, deployment, service_port, user_id)

      let runLoop = true
      while (runLoop) {
        const test = await waitGetCompletedPodPhase(deployment, user_id)
        if (test === "Running") {
          console.log("Pod has started and is running")
          runLoop = false;
          break
        }
      }

      if (ingress_err) return ingress_err;
      return labs_protocol + hostname
    } catch (_error) {
      const response_ingress = await networking_v1_api.namespace(user_id).getIngressList();
      for (const i of response_ingress.items) {
        const rules = i?.spec?.rules ?? [];
        for (const item of rules) {
          const host_split = item.host ?? "";
          const host = host_split.split(".")
          const domain_user = deployment + "-" + user_id
          if (domain_user == host[0]) {
            return labs_protocol + hostname
          }
        }
      }
    }
  } else {
    const response = await getServiceExposedIP(deployment, user_id)
    return await getHostPortFromResponse(response)
  }
}

try {
  const broker = await createBrokerAsPromised(config);
  broker.on('error', console.error);

  // Publish a message
  for (let i = 0; i < 100; i++) {
    const publication = await broker.publish('deployment_publish', 'Hello World!');
    publication.on('error', console.error);

    console.count('publish');
  }

  // Consume a message
  const subscription = await broker.subscribe('deployment_subscription');
  subscription
    .on('message', async (message, content, ackOrNack) => {
      const response = await deployContainer(
        ArrayBuffer.isView(content) || content instanceof ArrayBuffer ?
          new TextDecoder().decode(content) :
          content
      );

      // response = deploy_container(str(body, 'utf-8'))
      // ch.basic_publish(exchange='',
      //                 routing_key=props.reply_to,
      //                 properties=pika.BasicProperties(correlation_id = \
      //                 props.correlation_id,
      //                 expiration='30000'),
      //                 body=str(response))
      // ch.basic_ack(delivery_tag=method.delivery_tag)

      console.log(content);
      const props = message.properties;
      const method = message.fields;
      const publication = await broker.publish('deployment_publish', String(response), {
        routingKey: props.replyTo,
        options: {
          correlationId: props.correlationId,
          expiration: 30_000,
        }
      });
      ackOrNack();
    })
    .on('error', console.error);
} catch (err) {
  console.error(err);
}