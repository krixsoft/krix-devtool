import { EndpointConnector } from './background/endpoint-connector';

console.log(`BgS: Hello World!`);

const endpointConnector = EndpointConnector.getInstance();

chrome.runtime.onConnect.addListener((port) => {
  endpointConnector.onConnect(port);
});
