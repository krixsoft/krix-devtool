import * as KrixStateStore from '@krix/state-store';
import * as Core from '@krix-devtool/core';
import { MessageRetranslator } from './message-retranslator';
import { PackageStore } from './package.store';

export class StateStoreCommand extends Core.Singleton {
  private messageRetranslator: MessageRetranslator;
  private packageStore: PackageStore;

  initDeps (
  ): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
    this.packageStore = PackageStore.getInstance();
  }

  /**
   * Sends a store instance to the DTA to update his store. This command gets a current store
   * from a store-package by the package id (store name) and emulates `Set State` command with
   * a full store as a state value.
   *
   * @param  {string} packageId
   * @return {void}
   */
  syncStore (
    packageId: string,
  ): void {
    const stateStore: KrixStateStore.StateStore = this.packageStore.getPackageInst(
      Core.Enums.PackageName.StateStore,
      packageId,
    );

    const store = stateStore.getState();
    const messsag: Core.Interfaces.PackageMessage = {
      packageName: Core.Enums.PackageName.StateStore,
      packageId: packageId,
      command: {
        name: KrixStateStore.Enums.StoreCommandName.SetState,
        data: {
          statePath: '',
          state: [ '' ],
          oldValue: store,
          newValue: store,
        },
      },
    };

    this.messageRetranslator.sendMessage(
      Core.Enums.MsgCommands.DevToolPlugin.HandleStoreCommand,
      messsag,
    );
  }
}
