import * as _ from 'lodash';
import * as Core from '@krix-devtool/core';

import { MessageHandler } from './message-handler';
import { MessageRetranslator } from './message-retranslator';

export class EndpointConnector extends Core.Singleton {
  private messageHandler: MessageHandler;
  private messageRetranslator: MessageRetranslator;

  initDeps (): void {
    this.messageHandler = MessageHandler.getInstance();
    this.messageRetranslator = MessageRetranslator.getInstance();
  }

  public onConnect (
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onConnect:`, port);

    if (port.name === Core.Constants.CSToBgSConnectionName) {
      const tab = port.sender.tab;
      const tabId = tab.id;
      this.messageRetranslator.setCSPort(tabId, port);
    }

    port.onMessage.addListener((message, senderPort) => {
      this.onMessage(message, senderPort);
    });

    port.onDisconnect.addListener((disconnectedPort) => {
      console.log(`EndpointConnector - onDisconnect:`, disconnectedPort);
      this.onDisconnect(disconnectedPort);
    });
  }

  private onDisconnect (
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onDisconnect:`, port);
  }

  private onMessage (
    message: Core.Interfaces.BaseMessage,
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onMessage:`, message, port);

    const endpoint = _.get(message, `ept`, null);
    switch (endpoint) {
      case Core.Enums.AppEndpoint.BackgroundScript:
        this.messageHandler.onMessage(message, port);
        return;
      case Core.Enums.AppEndpoint.DevToolApp:
      case Core.Enums.AppEndpoint.ContentScript:
      case Core.Enums.AppEndpoint.DevToolPlugin:
        this.messageRetranslator.sendMessage(message);
        return;
      default:
        console.warn(`EndpointConnector - onMessage:`,
          `BgS is trying to handle the unsupported endpoint (${message.id}:${message.ept})`);
    }
  }
}
