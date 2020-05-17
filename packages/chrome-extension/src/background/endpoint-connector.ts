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

  /**
   * `Connect` handler.
   * - registers CS - adds the port to `Message Retranslator` by a tab identifier.
   * - adds `Message` and `Disconnect` watchers.
   *
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  public onConnect (
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onConnect:`, port);

    // Register CS
    if (port.name === Core.Constants.CSToBgSConnectionName) {
      // Get a tab identifier from port's settings
      const tab = port.sender.tab;
      const tabId = tab.id;
      // Add port to the message retranslator
      this.messageRetranslator.setCSPort(tabId, port);
    }

    // Add `Message` watcher for the port
    port.onMessage.addListener((message, senderPort) => {
      this.onMessage(message, senderPort);
    });

    // Add `Disconnect` watcher for the port
    port.onDisconnect.addListener((disconnectedPort) => {
      console.log(`EndpointConnector - onDisconnect:`, disconnectedPort);
      this.onDisconnect(disconnectedPort);
    });
  }

  /**
   * `Disconnect` handler.
   *
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private onDisconnect (
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onDisconnect:`, port);
  }

  /**
   * `Message` handler.
   * - extracts a message endpoint from the message.
   * - sends the message to another endpoint if the message endpoint isn't the BgS.
   * - dispatches the message to the BgS message handler if the message endpoint is the BgS.
   * - skips unsupported endpoints.
   *
   * @param  {Core.Interfaces.BaseMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private onMessage (
    message: Core.Interfaces.BaseMessage,
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onMessage:`, message, port);

    // Extract a message endpoint from the message
    const endpoint = _.get(message, `endpoint`, null);
    switch (endpoint) {
      // Dispatche the message to the BgS message handler
      case Core.Enums.AppEndpoint.BackgroundScript:
        this.messageHandler.onMessage(message, port);
        return;
      // Send the message to another endpoint
      case Core.Enums.AppEndpoint.DevToolApp:
      case Core.Enums.AppEndpoint.ContentScript:
      case Core.Enums.AppEndpoint.DevToolPlugin:
        this.messageRetranslator.sendMessage(message);
        return;
      // Skip unsupported endpoints
      default:
        console.warn(`EndpointConnector - onMessage:`,
          `BgS is trying to handle the unsupported endpoint (${message.tabId}:${message.endpoint})`);
    }
  }
}
