import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';

// Services
import { StateStoreHistoryService } from './ss-history.service';

@Injectable()
export class StateStoreMessageHandler {
  private stateStoresNames: string[];

  private sjCommand: Subject<Core.Interfaces.EndpointMessage>;

  constructor (
    private ssHistoryService: StateStoreHistoryService,
  ) {
    this.sjCommand = new Subject();
  }

  /**
   * Creates an observable object which gets DTA commands.
   *
   * @return {Observable<Core.Interfaces.EndpointMessage>}
   */
  getCommandObserver (
  ): Observable<Core.Interfaces.EndpointMessage> {
    return this.sjCommand.asObservable();
  }

  /**
   * Returns the list of state store names.
   *
   * @return {string[]}
   */
  getStateStoresNames (
  ): string[] {
    return this.stateStoresNames;
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
        this.ssHistoryService.onMessage(message.payload.command);
        break;
      case Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList:
        this.stateStoresNames = message.payload.packageIds;
        break;
      default:
        console.error(`DTA.StateStoreMessageHandler.onMessage: Catch unsupported command`);
        break;
    }
    this.sjCommand.next(message);
  }
}
