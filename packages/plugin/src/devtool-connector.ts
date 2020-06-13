import type * as KrixStateStore from '@krix/state-store';
import * as Core from '@krix-devtool/core';
import { MessageRetranslator } from './message-retranslator';
import { PackageStore } from './package.store';
import { EndpointConnector } from './endpoint-connector';
import { StateStoreCommand } from './state-store.command';

export class DevToolConnectorPlugin
  extends Core.Singleton
  implements Core.Interfaces.OnInit, Core.Interfaces.InitDeps
{
  private messageRetranslator: MessageRetranslator;
  private packageStore: PackageStore;
  private endpointConnector: EndpointConnector;
  private stateStoreCommand: StateStoreCommand;

  initDeps (
  ): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
    this.packageStore = PackageStore.getInstance();
    this.endpointConnector = EndpointConnector.getInstance();
    this.stateStoreCommand = StateStoreCommand.getInstance();
  }

  onInit (
  ): void {
    this.endpointConnector.connect();
  }

  /**
   * Connects the state store instance to the Dev Tool extension by the specific name.
   *
   * @param  {string} storeName - state store name
   * @param  {KrixStateStore.StateStore} stateStore - state store instance
   */
  connectStateStore (
    storeName: string,
    stateStore: KrixStateStore.StateStore,
  ): void {
    this.packageStore.setPackageInst(Core.Enums.PackageName.StateStore, storeName, stateStore);

    // Emit a first command to DTA to update his store.
    this.stateStoreCommand.syncStore(storeName);

    // Subscibe on changes of `Store Command` flow of the state store
    stateStore.getStoreCommandObserver()
      .subscribe((storeCommand) => {
        this.messageRetranslator.sendPackageMessage(
          Core.Enums.PackageName.StateStore,
          storeName,
          storeCommand,
        );
      });
  }
}
