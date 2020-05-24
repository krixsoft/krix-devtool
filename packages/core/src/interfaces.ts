import * as Enums from './enums';

export interface OnInit {
  onInit(): void;
}

export interface InitDeps {
  initDeps(): void;
}

export interface EndpointMessage extends BridgeMessage {
  tabId: number;
  endpoint: Enums.AppEndpoint;
}

export interface BridgeMessage <PayloadType = any> {
  command: Enums.MsgCommands;
  payload?: PayloadType;
}
