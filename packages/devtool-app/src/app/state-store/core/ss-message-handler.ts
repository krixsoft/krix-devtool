import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';

// Services
import { HistoryService } from './history.service';

@Injectable()
export class StateStoreMessageHandler {

  constructor (
    private historyService: HistoryService,
  ) {
  }

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {Core.Interfaces.EndpointMessage} message
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.EndpointMessage,
  ): void {
    switch (message.command) {
      case Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand:
        this.historyService.onMessage(message.payload.command);
        break;
      default:
        console.error(`DTA.StateStoreMessageHandler.onMessage: Catch unsupported command`);
        break;
    }
  }
}
