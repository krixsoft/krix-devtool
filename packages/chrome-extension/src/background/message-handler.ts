import * as _ from 'lodash';
import * as Core from '@krix-devtool/core';

import { MessageRetranslator } from './message-retranslator';

const MsgCommands = Core.Enums.MsgCommands;

export class MessageHandler extends Core.Singleton {
  private messageRetranslator: MessageRetranslator;

  initDeps (): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
  }

  onMessage (
    message: Core.Interfaces.BaseMessage,
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

  private handleDTAMessages (
    message: Core.Interfaces.BaseMessage,
    port: chrome.runtime.Port,
  ): void {
    switch (message.type) {
      case MsgCommands.DevToolApp.InitDevTool: {
        this.messageRetranslator.setDTAPort(message.id, port);
        return;
      }
    }
  }

  private handleCSMessages (
    message: Core.Interfaces.BaseMessage,
    port: chrome.runtime.Port,
  ): void {
  }
}
