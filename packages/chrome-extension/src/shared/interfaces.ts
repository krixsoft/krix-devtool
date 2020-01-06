import * as Enums from './enums';

export interface BridgeMetadata {
  csPort: chrome.runtime.Port;
  dtaPort: chrome.runtime.Port;
}

export interface BridgeNotification {
  id: number;
  type: Enums.BridgeNotificationType;
}
