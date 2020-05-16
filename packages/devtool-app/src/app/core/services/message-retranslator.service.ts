import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';

@Injectable()
export class MessageRetranslatorService {
  private bgsPort: chrome.runtime.Port;
  private tabId: number;

  setBgSPort (port: chrome.runtime.Port): void {
    this.bgsPort = port;
  }

  setTabId (id: number): void {
    this.tabId = id;
  }

  sendMessage <TMsg = any> (
    endpoint: Core.Enums.AppEndpoint,
    msgCommand: any,
    msgData?: TMsg,
  ): void {
    if (endpoint === Core.Enums.AppEndpoint.ContentScript) {
      console.warn(`MessageRetranslatorService - sendMessage:`,
        `DTA is trying to send messages to the unsupported endpoint (${endpoint})`);
      return;
    }

    const messsag: Core.Interfaces.BaseMessage<TMsg> = {
      tabId: this.tabId,
      endpoint: endpoint,
      command: msgCommand,
      payload: msgData,
    };

    this.bgsPort.postMessage(messsag);
  }
}
