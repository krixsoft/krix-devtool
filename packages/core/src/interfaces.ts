import * as Enums from './enums';

export interface BaseMessage<PayloadType = any> {
  tabId: number;
  endpoint: Enums.AppEndpoint;
  command: Enums.MsgCommands;
  payload?: PayloadType;
}
