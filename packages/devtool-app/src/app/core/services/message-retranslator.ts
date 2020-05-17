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
   * Sends message to the specific endpoint by the endpoint type.
   *
   * @param  {Core.Interfaces.BaseMessage} message
   * @return {void}
   */
  sendMessage <TMsg = any> (
    endpoint: Core.Enums.AppEndpoint,
    msgCommand: any,
    msgData?: TMsg,
  ): void {
    if (endpoint === Core.Enums.AppEndpoint.ContentScript) {
      console.warn(`MessageRetranslatorService - sendMessage:`,
        `DTA is trying to send messages to the unsupported endpoint (${endpoint})`);
      return;
    }

    const messsag: Core.Interfaces.BaseMessage<TMsg> = {
      tabId: this.tabId,
      endpoint: endpoint,
      command: msgCommand,
      payload: msgData,
    };

    this.bgsPort.postMessage(messsag);
  }
}
