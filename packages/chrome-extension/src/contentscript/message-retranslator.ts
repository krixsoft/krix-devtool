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
    targetEndpoint: Core.Enums.AppEndpoint,
    msgType: Core.Enums.MsgCommands,
    msgData?: TMsg,
  ): void {
    if (targetEndpoint === Core.Enums.AppEndpoint.ContentScript) {
      console.warn(`MessageRetranslator - sendMessage:`,
        `CS is trying to send messages to the unsupported endpoint (${targetEndpoint})`);
      return;
    }

    const messsag: Core.Interfaces.ExtensionMessage<TMsg> = {
      tabId: this.id,
      target: targetEndpoint,
      source: Core.Enums.AppEndpoint.ContentScript,
      command: msgType,
      payload: msgData,
    };

    this.bgsPort.postMessage(messsag);
  }
}
