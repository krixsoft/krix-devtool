import * as Core from '@krix-devtool/core';

import { MessageRetranslator } from './message-retranslator';

const MsgCommands = Core.Enums.MsgCommands;

export class MessageHandler extends Core.Singleton {
  private messageRetranslator: MessageRetranslator;

  initDeps (): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
  }

  /**
   * `Message` handler.
   * - dispatches DTA and CS messages to the specific message handler.
   *
   * @param  {Core.Interfaces.EndpointMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.EndpointMessage,
    port: chrome.runtime.Port,
  ): void {
    switch (port.name) {
      case Core.Constants.DTAToBgSConnectionName:
        this.handleDTAMessages(message, port);
        return;
      case Core.Constants.CSToBgSConnectionName:
        this.handleCSMessages(message, port);
        return;
    }
  }

  /**
   * DTA `Message` handler.
   *
   * @param  {Core.Interfaces.EndpointMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private handleDTAMessages (
    message: Core.Interfaces.EndpointMessage,
    port: chrome.runtime.Port,
  ): void {
    switch (message.command) {
      case MsgCommands.DevToolApp.InitDevTool: {
        this.messageRetranslator.setDTAPort(message.tabId, port);
        return;
      }
    }
  }

  /**
   * CS `Message` handler.
   *
   * @param  {Core.Interfaces.EndpointMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private handleCSMessages (
    message: Core.Interfaces.EndpointMessage,
    port: chrome.runtime.Port,
  ): void {
  }
}
