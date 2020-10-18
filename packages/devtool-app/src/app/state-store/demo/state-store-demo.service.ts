import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { interval } from 'rxjs';

import { MessageHandler } from '../../core/data-flow';
import { BaseManager } from '../../shared/base.manager';

// SS
import { GlobalStore } from './stores/global.store';
import { Interfaces } from './shared';
import { Enums } from './shared';
import { StateStore } from './state-store.service';

@Injectable()
export class StateStoreDemoService extends BaseManager {
  public userCounter: number;
  public currentUserId: string;

  constructor (
    private messageHandler: MessageHandler,
    // SS
    private stateStore: StateStore,
    private globalStore: GlobalStore,
  ) {
    super();
  }

  /**
   * Starts an emulator which generates and emits data to the state store.
   *
   * @return {void}
   */
  startEmulator (
  ): void {
    const increaseUserCounter$ = interval(1000)
      .subscribe(() => {
        this.globalStore.increaseUserCounter();
      });
    this.subscribe(increaseUserCounter$);

    const decreaseUserCounter$ = interval(4500)
      .subscribe(() => {
        this.globalStore.decreaseUserCounter();
      });
    this.subscribe(decreaseUserCounter$);

    const resetUserCounter$ = interval(15000)
      .subscribe(() => {
        this.globalStore.resetUserCounter();
      });
    this.subscribe(resetUserCounter$);

    this.globalStore.setCurrentUserId('ec56j-bff46-1apyt-cai0g0-hell0');

    const resources: Interfaces.Resource[] = [
      {
        name: Enums.ResourceName.User,
        value: {
          id: 'ec56j-bff46-1apyt-cai0g0-hell0',
          name: 'Ivan',
          age: 25,
          organization: 1,
        },
      },
      {
        name: Enums.ResourceName.Organization,
        value: {
          id: 1,
          name: 'Megacorp',
        },
      },
      {
        name: Enums.ResourceName.Item,
        value: {
          id: 149,
          name: 'Ultraphone',
        },
      },
      {
        name: Enums.ResourceName.Price,
        value: {
          itemId: 149,
          value: 4.99,
          currency: `$`,
        },
      },
      {
        name: Enums.ResourceName.Price,
        value: {
          itemId: 149,
          value: 5.00,
          currency: `$`,
        },
      },
    ];

    const lastResourceUpdate$ = interval(5000)
      .subscribe(() => {
        const resourceIndex = this.getRandomInt(0, resources.length);
        const resource = resources[resourceIndex];
        this.globalStore.emitLastResourceUpdate(resource.name, resource.value);
      });
    this.subscribe(lastResourceUpdate$);

    this.messageHandler.onMessage({
      command: Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList,
      target: null,
      source: null,
      payload: {
        packageName: Core.Enums.PackageName.StateStore,
        packageIds: [ 'main' ],
      },
    });

    const storeCommandObserver = this.stateStore.krixStateStore.getStoreCommandObserver()
      .subscribe((command) => {
        this.messageHandler.onMessage({
          command: Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand,
          target: null,
          source: null,
          payload: {
            packageName: Core.Enums.PackageName.StateStore,
            packageId: 'main',
            command: command,
          },
        });
      });
    this.subscribe(storeCommandObserver);
  }

  /**
   * Stops all emulator's tasks.
   *
   * @return {void}
   */
  stopEmulator (
  ): void {
    this.stopAllSubscriptions();
  }

  /**
   * HELPERs
   */

  /**
   * Returns a random number in a specific interval.
   *
   * @param  {number} min
   * @param  {number} max
   * @return {number}
   */
  getRandomInt (
    min: number,
    max: number,
  ): number {
    const ceiledMin = Math.ceil(min);
    const flooredMax = Math.floor(max);
    const randomNumber = Math.floor(Math.random() * (flooredMax - ceiledMin)) + ceiledMin;
    return randomNumber;
  }
}
