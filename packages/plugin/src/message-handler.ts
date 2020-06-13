import * as Core from '@krix-devtool/core';

export class MessageHandler extends Core.Singleton {

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  onMessage (
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

    console.log(`MessageHandler - onMessage:`, event);
  }
}
