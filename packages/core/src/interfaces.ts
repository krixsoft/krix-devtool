import * as Enums from './enums';

import * as Constants from './constants';

export interface BaseMessage<PayloadType = any> {
  app: typeof Constants.AppName;
  ept: Enums.AppEndpoint;
  payload: PayloadType;
}
