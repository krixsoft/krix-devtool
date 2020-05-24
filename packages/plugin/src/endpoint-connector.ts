import * as Core from '@krix-devtool/core';

export class EndpointConnector extends Core.Singleton {

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
      this.onMessage(event);
    }, false);
  }

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  private onMessage (
    event: MessageEvent,
  ): void {
    console.log(`EndpointConnector - onMessage:`, event);
  }
}
