import * as _ from 'lodash';
import * as Core from '@krix-devtool/core';

export class MessageRetranslator extends Core.Singleton {
  private bgsPort: chrome.runtime.Port;
  private tabId: number;

  /**
   * Sets a port of the BgS.
   *
   * @return {number}
   */
  setBgSPort (
    port: chrome.runtime.Port,
  ): void {
    this.bgsPort = port;
  }

  /**
   * Sets a tab id for the current CS.
   *
   * @return {number}
   */
  setTabId (
    tabId: number,
  ): void {
    this.tabId = tabId;
  }

  /**
   * Returns a tab id for the current CS.
   *
   * @return {number}
   */
  getTabId (
  ): number {
    return this.tabId;
  }

  /**
   * Sends message to the specific endpoint by the endpoint type.
   *
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @return {void}
   */
  sendMessage (
    message: Core.Interfaces.ExtensionMessage,
  ): void {
    switch (message.target) {
      // Send message to a DTA
      case Core.Enums.AppEndpoint.BackgroundScript:
      case Core.Enums.AppEndpoint.DevToolApp: {
        if (_.isNil(this.bgsPort)) {
          console.warn(`CS * MessageRetranslator - sendMessage:`,
            `CS is trying to send messages to the unregistered BgS (${message.tabId})`);
          return;
        }

        this.bgsPort.postMessage(message);
        return;
      }
      // Send message to a CS or DTP
      case Core.Enums.AppEndpoint.DevToolPlugin: {
        window.postMessage(message, '*');
        return;
      }
      // Skip unsupported endpoints
      default:
        console.warn(`CS * MessageRetranslator - sendMessage:`,
          `CS is trying to send messages to the unsupported endpoint (${message.tabId}:${message.target})`);
    }
  }
}
