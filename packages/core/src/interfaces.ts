import * as Enums from './enums';

export interface OnInit {
  onInit(): void;
}

export interface InitDeps {
  initDeps(): void;
}

export interface BaseMessage <PayloadType = any> {
  tabId: number;
  endpoint: Enums.AppEndpoint;
  command: Enums.MsgCommands;
  payload?: PayloadType;
}
