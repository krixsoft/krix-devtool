import { EndpointConnector } from './background/endpoint-connector';

console.log(`BgS: Hello World!`);

const endpointConnector = EndpointConnector.getInstance();

endpointConnector.connect();
