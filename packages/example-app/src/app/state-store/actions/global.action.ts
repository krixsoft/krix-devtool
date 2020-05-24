import { Injectable } from '@angular/core';

// Services
import { StateStore } from '../state-store.service';
import { Interfaces, Enums } from '../shared';

@Injectable()
export class GlobalAction {
  constructor (private stateStore: StateStore) {
    const initialState: Interfaces.GlobalStore = {
      userCounter: 0,
      userId: null,
    };

    this.stateStore.setState({
      state: [ 'global' ],
      value: initialState,
    });
  }

  /**
   * Increases a `User Counter` state by one.
   *
   * @return {void}
   */
  increaseUserCounter (
  ): void {
    const prevCounterState = this.stateStore.getState<number>([ 'global', 'userCounter' ]);
    const newCounterState = prevCounterState + 1;

    this.stateStore.setState({
      state: [ 'global', 'userCounter' ],
      value: newCounterState,
    });
  }

  /**
   * Decreases a `User Counter` state by one.
   *
   * @return {void}
   */
  decreaseUserCounter (
  ): void {
    const prevCounterState = this.stateStore.getState<number>([ 'global', 'userCounter' ]);

    if (prevCounterState === 0) {
      return;
    }
    const newCounterState = prevCounterState - 1;

    this.stateStore.setState({
      state: [ 'global', 'userCounter' ],
      value: newCounterState,
    });
  }

  /**
   * Resets a `User Counter` state - sets this state at 0.
   *
   * @return {void}
   */
  resetUserCounter (
  ): void {
    this.stateStore.setState({
      state: [ 'global', 'userCounter' ],
      value: 0,
    });
  }

  /**
   * Emits a `Last Resource` state. We can use this state to watch changes in a resource
   * which we have got from an externel source.
   *
   * @signal
   * @return {void}
   */
  emitLastResourceUpdate <ResourceValueType> (
    resourceName: Enums.ResourceName,
    resourceValue: ResourceValueType,
  ): void {
    const resource: Interfaces.Resource = {
      name: resourceName,
      value: resourceValue,
    };

    this.stateStore.setState({
      state: [ 'global', 'lastResource' ],
      value: resource,
      options: {
        signal: true,
      },
    });
  }

  /**
   * Sets a `User Id` state for the current user.
   *
   * @return {void}
   */
  setCurrentUserId (
    userId: string,
  ): void {
    this.stateStore.setState({
      state: [ 'global', 'userId' ],
      value: userId,
    });
  }
}
