import * as Core from '@krix-devtool/core';

export class MessageRetranslator extends Core.Singleton {
  private bgsPort: chrome.runtime.Port;
  private id: number;

  setBgSPort (port: chrome.runtime.Port): void {
    this.bgsPort = port;
  }

  setIdentifier (id: number): void {
    this.id = id;
  }

  sendMessage <TMsg = any> (
    endpoint: Core.Enums.AppEndpoint,
    msgType: Core.Enums.MsgCommands,
    msgData?: TMsg,
  ): void {
    if (endpoint === Core.Enums.AppEndpoint.ContentScript) {
      console.warn(`MessageRetranslator - sendMessage:`,
        `CS is trying to send messages to the unsupported endpoint (${endpoint})`);
      return;
    }

    const messsag: Core.Interfaces.BaseMessage<TMsg> = {
      tabId: this.id,
      endpoint: endpoint,
      command: msgType,
      payload: msgData,
    };

    this.bgsPort.postMessage(messsag);
  }
}
