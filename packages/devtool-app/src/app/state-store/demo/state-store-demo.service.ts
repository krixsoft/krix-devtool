import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';

import { MessageHandler } from '../../core/data-flow';

// SS
import { GlobalStore } from './stores/global.store';
import { Interfaces } from './shared';
import { Enums } from './shared';
import { StateStore } from './state-store.service';

@Injectable()
export class StateStoreDemoService {
  public userCounter: number;
  public currentUserId: string;

  constructor (
    private messageHandler: MessageHandler,
    // SS
    private stateStore: StateStore,
    private globalStore: GlobalStore,
  ) { }

  /**
   * Starts an emulator which generates and emits data to the state store.
   *
   * @return {void}
   */
  startStateStoreEmulator (
  ): void {
    setInterval(() => {
      this.globalStore.increaseUserCounter();
    }, 1000);

    setInterval(() => {
      this.globalStore.decreaseUserCounter();
    }, 4500);

    setInterval(() => {
      this.globalStore.resetUserCounter();
    }, 15000);

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

    setInterval(() => {
      const resourceIndex = this.getRandomInt(0, resources.length);
      const resource = resources[resourceIndex];
      this.globalStore.emitLastResourceUpdate(resource.name, resource.value);
    }, 5000);

    this.stateStore.krixStateStore.getStoreCommandObserver()
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
