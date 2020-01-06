import * as Enums from './enums';

export interface BaseMessage<PayloadType = any> {
  id: number;
  ept: Enums.AppEndpoint;
  type: Enums.MsgCommands;
  payload?: PayloadType;
}
