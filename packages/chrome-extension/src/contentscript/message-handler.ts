import * as Core from '@krix-devtool/core';

import { MessageRetranslator } from './message-retranslator';

export class MessageHandler extends Core.Singleton {
  private messageRetranslator: MessageRetranslator;

  initDeps (
  ): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
  }

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.EndpointMessage,
  ): void {
    switch (message.command) {
      case Core.Enums.MsgCommands.BackgroundScript.InitCS:
        this.onInitCS(message.payload);
        break;
      default:
        console.error(`CS.MessageHandler.onMessage: Catch unsupported command`);
        break;
    }

    console.log(`CS.MessageHandler.onMessage:`, message);
  }

  /**
   * Handles `Init CS` command. This logic sets a `Tab Id` to the message retranslator.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.Request.InitCSCommand} message
   * @return {void}
   */
  onInitCS (
    message: Core.Interfaces.EndpointMessagePayload.Response.InitCSCommand,
  ): void {
    this.messageRetranslator.setTabId(message?.tabId);
  }
}
