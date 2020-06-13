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
   *
   * @return {void}
   */
  public connect (
  ): void {
    console.log(`DTP * EndpointConnector - connect:`);

    // Add `Message` watcher
    window.addEventListener('message', (event: MessageEvent) => {
      this.onMessage(event);
    }, false);
  }

  /**
   * Handles a `Message` flow for a current connection.
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
    if (event.source !== window) {
      console.log(`MessageHandler - onMessage: Catch signal from unsupported provider`);
      return;
    }
    const message: Core.Interfaces.EndpointMessage = event.data;

    if (message.target !== Core.Enums.AppEndpoint.DevToolPlugin) {
      return;
    }

    this.messageHandler.onMessage(message);
  }
}
