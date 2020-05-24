import { Component, OnInit } from '@angular/core';

// SS
import { GlobalAction } from './state-store/actions/global.action';
import { StateStore } from './state-store/state-store.service';
import { Interfaces } from './state-store/shared';
import { Enums } from './state-store/shared';

@Component({
  selector: 'krix-devtool-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  public userCounter: number;
  public currentUserId: string;

  constructor (
    // SS
    private stateStore: StateStore,
    private globalAction: GlobalAction,
  ) { }

  ngOnInit (
  ): void {
    this.startStateStoreEmulator();

    this.stateStore.select([ 'global', 'userCounter' ])
      .subscribe((userCounter) => {
        this.userCounter = userCounter;
      });

    this.currentUserId = this.stateStore.getState([ 'global', 'userId' ]);
  }

  /**
   * Starts an emulator which generates and emits data to the state store.
   *
   * @return {void}
   */
  startStateStoreEmulator (
  ): void {
    setInterval(() => {
      this.globalAction.increaseUserCounter();
    }, 1000);

    setInterval(() => {
      this.globalAction.decreaseUserCounter();
    }, 4500);

    setInterval(() => {
      this.globalAction.resetUserCounter();
    }, 15000);

    this.globalAction.setCurrentUserId('ec56j-bff46-1apyt-cai0g0-hell0');

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
      this.globalAction.emitLastResourceUpdate(resource.name, resource.value);
    }, 5000);
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
