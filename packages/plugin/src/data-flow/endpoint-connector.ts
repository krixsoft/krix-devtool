import * as Core from '@krix-devtool/core';

import { MessageHandler } from './message-handler';

export class EndpointConnector extends Core.Singleton {
  private messageHandler: MessageHandler;

  initDeps (
  ): void {
    this.messageHandler = MessageHandler.getInstance();
  }

  /**
   * Creates a connection to the CS.
   * - subscribes to `message` window events (calls the `onMessage` logic after every event).
   *
   * @return {void}
   */
  public connect (
  ): void {
    console.log(`DTP.EndpointConnector.connect:`);

    // Subscribe to `message` window events
    window.addEventListener('message', (event: MessageEvent) => {
      this.onMessage(event);
    }, false);
  }

  /**
   * Handles a `Message` event.
   * - skips messages from an outside endpoint (not current tab);
   * - extracts a message from the message event;
   * - skips unsupported endpoints;
   * - dispatches the message to the CS message handler.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  private onMessage (
    event: MessageEvent,
  ): void {
    // Skips messages from an outside endpoint (not current tab);
    if (event.source !== window) {
      console.log(`DTP.MessageHandler.onMessage: Catch signal from unsupported provider`);
      return;
    }
    // Extracts a message from the message event
    const message: Core.Interfaces.EndpointMessage = event.data;

    // Skip unsupported endpoints
    if (message.target !== Core.Enums.AppEndpoint.DevToolPlugin) {
      return;
    }

    // Dispatche the message to the CS message handler
    this.messageHandler.onMessage(message);
  }
}
