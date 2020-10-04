import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

import { Interfaces } from '../shared';

@Injectable()
export class HistoryService {
  private krixStateStore: KrixStateStore.StateStore;

  private history: Interfaces.HistoryItem[];
  private currentHistoryItemIndex: number;
  private currentHistoryItem: Interfaces.HistoryItem;

  private sjHistoryChange: Subject<null>;

  private historyMessageNumber: number;

  constructor (
  ) {
    this.krixStateStore = KrixStateStore.StateStore.create();

    this.sjHistoryChange = new Subject();

    this.history = [];
    this.currentHistoryItemIndex = -1;
    this.historyMessageNumber = 0;
  }

  getHistoryChangeObserver (
  ): Observable<null> {
    return this.sjHistoryChange.asObservable();
  }

  getStateStore (
  ): KrixStateStore.StateStore {
    return this.krixStateStore;
  }

  getHistory (
  ): Interfaces.HistoryItem[] {
    return [ ...this.history ];
  }

  getCurrentHistoryItem (
  ): Interfaces.HistoryItem {
    return this.currentHistoryItem;
  }

  onMessage (
    message: KrixStateStore.Interfaces.StoreCommand,
  ): void {
    if (message.name !== KrixStateStore.Enums.StoreCommandName.SetState) {
      return;
    }

    const historyItem: Interfaces.HistoryItem = _.assign({
      id: this.historyMessageNumber,
    }, message.data);
    this.historyMessageNumber += 1;

    this.history.push(historyItem);

    if (this.history.length - 2 === this.currentHistoryItemIndex) {
      this.goToNextDirection(1);
      this.currentHistoryItemIndex += 1;
      this.currentHistoryItem = this.history[this.currentHistoryItemIndex];
    }

    this.sjHistoryChange.next(null);
  }

  /**
   * Sets the state-store to the new state (shifts store on N steps) and changes the current history item.
   *
   * @param  {number} newCurrentHistoryItemIndex
   * @return {void}
   */
  goToHistoryItem (
    newCurrentHistoryItemId: number,
  ): void {
    const newCurrentHistoryItemIndex = _.findIndex(this.history, [ 'id', newCurrentHistoryItemId ]);
    if (newCurrentHistoryItemIndex === this.currentHistoryItemIndex) {
      return;
    }

    if (newCurrentHistoryItemIndex > this.currentHistoryItemIndex) {
      const stepsCount = newCurrentHistoryItemIndex - this.currentHistoryItemIndex;
      this.goToNextDirection(stepsCount);
    } else {
      const stepsCount = this.currentHistoryItemIndex - newCurrentHistoryItemIndex;
      this.goToPrevDirection(stepsCount);
    }

    this.currentHistoryItemIndex = newCurrentHistoryItemIndex;
    this.currentHistoryItem = this.history[newCurrentHistoryItemIndex];

    this.sjHistoryChange.next(null);
  }

  /**
   * Sets the state-store to the next state (shifts store on N steps).
   * - starts from the next item relative the current history item;
   * - uses the `newValue` field in every history item to changes the state-store.
   *
   * @param  {number} stepsCount
   * @return {void}
   */
  private goToNextDirection (
    stepsCount: number,
  ) {
    for (let i = 1; i <= stepsCount; i++) {
      const nextHistoryItemIndex = this.currentHistoryItemIndex + i;
      const nextHistoryItem = this.history[nextHistoryItemIndex];
      this.krixStateStore.setState({
        state: nextHistoryItem.state,
        value: nextHistoryItem.newValue,
      });
    }
  }

  /**
   * Sets the state-store to the previous state (shifts store on N steps).
   * - starts from the current history item;
   * - uses the `oldValue` field in every history item to changes the state-store.
   *
   * @param  {number} stepsCount
   * @return {void}
   */
  private goToPrevDirection (
    stepsCount: number,
  ) {
    for (let i = 0; i < stepsCount; i++) {
      const prevHistoryItemIndex = this.currentHistoryItemIndex - i;
      const prevHistoryItem = this.history[prevHistoryItemIndex];
      this.krixStateStore.setState({
        state: prevHistoryItem.state,
        value: prevHistoryItem.oldValue,
      });
    }

    const newCurrentHistoryItemIndex = this.currentHistoryItemIndex - stepsCount;
    const newCurrentHistoryItem = this.history[newCurrentHistoryItemIndex];
    this.krixStateStore.setState({
      state: newCurrentHistoryItem.state,
      value: newCurrentHistoryItem.newValue,
    });
  }
}
