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
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.ExtensionMessage,
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
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private handleDTAMessages (
    message: Core.Interfaces.ExtensionMessage,
    port: chrome.runtime.Port,
  ): void {
    switch (message.command) {
      case MsgCommands.BackgroundScript.InitDTA: {
        this.messageRetranslator.setDTAPort(message.tabId, port);
        return;
      }
    }
  }

  /**
   * CS `Message` handler.
   *
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  private handleCSMessages (
    message: Core.Interfaces.ExtensionMessage,
    port: chrome.runtime.Port,
  ): void {
    switch (message.command) {
      case MsgCommands.BackgroundScript.InitCS: {
        const tabId = port?.sender?.tab?.id;
        this.messageRetranslator.sendMessage<Core.Interfaces.EndpointMessagePayload.Response.InitCSCommand>({
          tabId: tabId,
          target: Core.Enums.AppEndpoint.ContentScript,
          source: Core.Enums.AppEndpoint.BackgroundScript,
          command: Core.Enums.MsgCommands.BackgroundScript.InitCS,
          payload: {
            tabId: tabId,
          },
        });
        return;
      }
    }
  }
}
