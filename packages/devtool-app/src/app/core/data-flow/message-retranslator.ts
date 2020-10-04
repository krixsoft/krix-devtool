import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';

@Injectable()
export class MessageRetranslator {
  private bgsPort: chrome.runtime.Port;
  private tabId: number;

  /**
   * Sets the BgS port.
   *
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  setBgSPort (port: chrome.runtime.Port): void {
    this.bgsPort = port;
  }

  /**
   * Sets the tab identifier.
   *
   * @param  {number} tabId
   * @return {void}
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
  sendMessage <TMsg = any> (
    targetEndpoint: Core.Enums.AppEndpoint,
    msgCommand: Core.Enums.MsgCommands,
    msgData?: TMsg,
  ): void {
    if (targetEndpoint === Core.Enums.AppEndpoint.ContentScript) {
      console.warn(`MessageRetranslatorService - sendMessage:`,
        `DTA is trying to send messages to the unsupported endpoint (${targetEndpoint})`);
      return;
    }

    const messsag: Core.Interfaces.ExtensionMessage<TMsg> = {
      tabId: this.tabId,
      target: targetEndpoint,
      source: Core.Enums.AppEndpoint.DevToolApp,
      command: msgCommand,
      payload: msgData,
    };

    this.bgsPort.postMessage(messsag);
  }
}
