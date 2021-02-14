import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';
import * as KrixStateStore from '@krix/state-store';

import { Environment } from '../../../environments/environment';

// Services
import { StateStoreHistoryService } from './ss-history.service';
import { StateStoreArbiter } from './ss.arbiter';

@Injectable()
export class StateStoreMessageHandler {
  private stateStoresNames: string[];

  private sjCommand: Subject<Core.Interfaces.EndpointMessage>;

  constructor (
    private ssHistoryService: StateStoreHistoryService,
    private ssArbiter: StateStoreArbiter,
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
      case Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand: {
        const activeStoreName = this.ssArbiter.getActiveStoreName();
        if (_.isNil(activeStoreName) === true
            || message.payload.packageId !== activeStoreName) {
          return;
        }

        this.ssHistoryService.onMessage(message.payload.command);
        break;
      }
      case Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList:
        this.ssArbiter.setStoreNames(message.payload.packageIds);
        break;
      case Core.Enums.MsgCommands.DevToolPlugin.ExecutePackageCommand:
        this.onMessageExecuteCommand(message.payload);
        break;
      default:
        // eslint-disable-next-line no-unused-expressions
      Environment.production === false && console.error(`DTA.StateStoreMessageHandler.onMessage: Catch unsupported command`);
        break;
    }
    this.sjCommand.next(message);
  }

  /**
   * Handles `Execute Command` command.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.Response.ExecutePackageCommand} command
   * @return {void}
   */
  onMessageExecuteCommand (
    command: Core.Interfaces.EndpointMessagePayload.Response.ExecutePackageCommand,
  ): void {
    switch (command.packageCommand) {
      case Core.Enums.StateStoreCommand.GetStore: {
        this.onMessageECGetStore(command.result);
        break;
      }
    }
  }

  /**
   * Handles `Execute Command` command with `Get Store` store command.
   *
   * @param  {unknown} store
   * @return {void}
   */
  onMessageECGetStore (
    store: object,
  ): void {
    const krixStateStore = KrixStateStore.StateStore.create();

    _.forEach(store, (value, key) => {
      krixStateStore.setState({
        state: [ key ],
        value: value,
      });
    });

    this.ssHistoryService.setStore(krixStateStore);
  }
}
