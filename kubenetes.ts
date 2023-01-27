// import { autoDetectClient } from 'https://deno.land/x/kubernetes_client@v0.3.2/mod.ts';
// import { CoreV1Api } from 'https://deno.land/x/kubernetes_apis/builtin/core@v1/mod.ts';

// const kubernetes = await autoDetectClient();
// const coreApi = new CoreV1Api(kubernetes).namespace("default");

// const podList = await coreApi.getPodList();
// console.log(podList);

import { autoDetectClient } from 'https://deno.land/x/kubernetes_client/mod.ts';
const kubernetes = await autoDetectClient();

const podList = await kubernetes.performRequest({
  method: 'GET',
  path: `/api/v1/namespaces/default/pods`,
  expectJson: true, // run JSON.parse on the response body
});
console.log(podList);