import { Injectable } from '@angular/core';
import { of as rxjsOf } from 'rxjs';
import type { Observable } from 'rxjs';
import { mergeMap as rxjsMergeMap } from 'rxjs/operators';

import * as KrixStateStore from '@krix/state-store';
import * as KrixDevToolPlugin from '@krix/devtool-plugin';

@Injectable()
export class StateStore {
  private krixStateStore: KrixStateStore.StateStore;
  private devToolConnectorPlugin: KrixDevToolPlugin.DevToolConnectorPlugin;

  constructor () {
    this.krixStateStore = KrixStateStore.StateStore.create();

    const secondStore = KrixStateStore.StateStore.create();
    secondStore.setState({
      state: [ 'superValue' ],
      value: 100500,
    });

    this.devToolConnectorPlugin = KrixDevToolPlugin.DevToolConnectorPlugin.getInstance();
    this.devToolConnectorPlugin.connectStateStore('main', this.krixStateStore);
    this.devToolConnectorPlugin.connectStateStore('dd', secondStore);
  }

  /**
   * Uses a `State Action` to set a single state in the store.
   *
   * @param  {KrixStateStore.Interfaces.StateAction} stateAction - state action
   * @return {void}
   */
  setState (
    stateAction: KrixStateStore.Interfaces.StateAction,
  ): void {
    this.krixStateStore.setState(stateAction);
  }

  /**
   * Uses a `State Action` to set multiple states in the store.
   *
   * @param  {KrixStateStore.Interfaces.StateAction[]} stateActions - state actions
   * @return {void}
   */
  setStates (
    stateActions: KrixStateStore.Interfaces.StateAction[],
  ): void {
    this.krixStateStore.setStates(stateActions);
  }

  /**
   * Returns a state by the specific state selector.
   *
   * @param  {string[]} stateSelector - state selector
   * @return {StateType}
   */
  getState <StateType = any> (
    stateSelector: string[],
  ): StateType {
    const state = this.krixStateStore.getState(stateSelector);
    return state;
  }

  /**
   * Returns a store (root state).
   *
   * @return {RootState}
   */
  getStore <RootState = any> (
  ): RootState{
    const state = this.krixStateStore.getState();
    return state;
  }

  /**
   * Returns a RxJS observable to catch changes of the specific state by the state selector.
   *
   * @param  {string[]} stateSelector - state selector
   * @return {Observable<StateType>}
   */
  select <StateType = any> (
    stateSelector: string[],
  ): Observable<StateType> {
    // FYI: Сonvert a "lite" RxJS observable to a "full" observable using a RxJS package from this project.
    return rxjsOf(null)
      .pipe(
        rxjsMergeMap(() => {
          const observer = this.krixStateStore.select(stateSelector);
          return observer;
        }),
      );
  }
}
