import * as Core from '@krix-devtool/core';
import * as _ from 'lodash';

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
   * Creates a connection to the CS.
   *
   * @return {void}
   */
  public connect (
  ): void {
    // Create a connection to the BgS
    const port = chrome.runtime.connect({
      name: Core.Constants.CSToBgSConnectionName,
    });

    console.log(`CS.EndpointConnector.connect:`, port);
    this.messageRetranslator.setBgSPort(port);

    // Add `On Message` listener to the BgS connection port
    port.onMessage.addListener((message, senderPort) => {
      this.onExtensionMessage(message, senderPort);
    });

    // Add `On Message` listener to the DTP connection
    window.addEventListener('message', (event) => {
      this.onDTPMessage(event);
    }, false);

    this.messageRetranslator.sendMessage({
      tabId: null,
      target: Core.Enums.AppEndpoint.BackgroundScript,
      source: Core.Enums.AppEndpoint.ContentScript,
      command: Core.Enums.MsgCommands.BackgroundScript.InitCS,
    });
  }

  /**
   * Handles a `Message` flow for a current connection.
   * - skips messages from an outside endpoint (not current tab);
   * - extracts a message endpoint from the message.
   * - sends the message to another endpoint if the message endpoint isn't the CS.
   * - dispatches the message to the CS message handler if the message endpoint is the CS.
   * - skips unsupported endpoints.
   *
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private onExtensionMessage (
    message: Core.Interfaces.ExtensionMessage,
    port: chrome.runtime.Port,
  ): void {
    console.log(`CS.EndpointConnector.onExtensionMessage:`, message, port);

    const tabId = this.messageRetranslator.getTabId();
    if ((_.isNil(tabId) === true || message?.tabId !== tabId)
        && message?.command !== Core.Enums.MsgCommands.BackgroundScript.InitCS) {
      console.warn(`CS.EndpointConnector.onExtensionMessage:`,
        `CS is trying to handle message from another tab (${message.tabId}:${message.target})`);
      return;
    }

    // Extract a message endpoint from the message
    const target = message?.target ?? null;
    switch (target) {
      // Dispatch the message to the CS message handler
      case Core.Enums.AppEndpoint.ContentScript:
        this.messageHandler.onMessage(message);
        return;
      // Send the message to another endpoint
      case Core.Enums.AppEndpoint.DevToolPlugin:
        this.messageRetranslator.sendMessage(message);
        return;
      // Skip unsupported endpoints
      default:
        console.warn(`CS.EndpointConnector.onExtensionMessage:`,
          `CS is trying to handle the unsupported endpoint (${message.tabId}:${message.target})`);
    }
  }

  /**
   * Handles a `Message` flow for a current connection.
   * - skips messages from an outside endpoint (not current tab);
   * - extracts a message from the message event;
   * - skips unsupported endpoints;
   * - dispatches the message to the CS message handler or resends it to the next endpoint.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  private onDTPMessage (
    event: MessageEvent,
  ): void {
    console.log(`CS.EndpointConnector.onDTPMessage:`, event);

    if (event.source !== window) {
      console.log(`CS.MessageHandler.onDTPMessage: Catch signal from unsupported provider`);
      return;
    }
    const message: Core.Interfaces.EndpointMessage = event.data;

    // Extract a message endpoint from the message
    const target = message?.target ?? null;
    switch (target) {
      // FYI: After every external request `window.addEventListener('message')` logic calls this method.
      // We don't send message to the `DTP` because we send them in `onExtensionMessage` logic.
      case Core.Enums.AppEndpoint.DevToolPlugin:
        return;
      // Dispatch the message to the CS message handler
      case Core.Enums.AppEndpoint.ContentScript:
        this.messageHandler.onMessage(message);
        return;
      // Send the message to another endpoint
      case Core.Enums.AppEndpoint.DevToolApp:
      case Core.Enums.AppEndpoint.BackgroundScript: {
        const tabId = this.messageRetranslator.getTabId();
        if (_.isNil(tabId) === true) {
          return;
        }

        // Add a tab id to every message from the DTP
        this.messageRetranslator.sendMessage({
          tabId: tabId,
          ...message,
        });
        return;
      }
      // Skip unsupported endpoints
      default:
        console.warn(`CS.EndpointConnector.onDTPMessage:`,
          `CS is trying to handle the unsupported endpoint (${message.target})`);
    }
  }
}
