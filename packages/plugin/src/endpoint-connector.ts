import * as Core from '@krix-devtool/core';

import { MessageHandler } from './message-handler';

export class EndpointConnector extends Core.Singleton {
  private messageHandler: MessageHandler;

  initDeps (): void {
    this.messageHandler = MessageHandler.getInstance();
  }

  /**
   * Creates a connection to the CS.
   *
   * @return {void}
   */
  public connect (
  ): void {
    console.log(`EndpointConnector - connect:`);

    // Add `Message` watcher
    window.addEventListener('message', (event: MessageEvent) => {
      this.messageHandler.onMessage(event);
    }, false);
  }
}
