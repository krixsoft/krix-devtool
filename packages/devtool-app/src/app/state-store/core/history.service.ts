import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

import { Interfaces } from '../shared';

@Injectable()
export class HistoryService {
  private krixStateStore: KrixStateStore.StateStore;

  private historyList: Interfaces.HistoryItem[];
  private currentHistoryItemIndex: number;
  private currentHistoryItem: Interfaces.HistoryItem;

  private sjHistoryChange: Subject<null>;

  private freeHistoryMessageNumber: number;

  constructor (
  ) {
    this.krixStateStore = KrixStateStore.StateStore.create();

    this.sjHistoryChange = new Subject();

    this.historyList = [];
    this.currentHistoryItemIndex = -1;
    this.freeHistoryMessageNumber = 0;
  }

  /**
   * Returns a history change observer (RxJS Observable).
   *
   * @return {Observable<null>}
   */
  getHistoryChangeObserver (
  ): Observable<null> {
    return this.sjHistoryChange.asObservable();
  }

  /**
   * Returns an instance of state store.
   *
   * @return {KrixStateStore.StateStore}
   */
  getStateStore (
  ): KrixStateStore.StateStore {
    return this.krixStateStore;
  }

  /**
   * Returns the list of history items (actions).
   *
   * @return {Interfaces.HistoryItem[]}
   */
  getHistory (
  ): Interfaces.HistoryItem[] {
    return [ ...this.historyList ];
  }

  /**
   * Returns the selected history item.
   *
   * @return {Interfaces.HistoryItem}
   */
  getCurrentHistoryItem (
  ): Interfaces.HistoryItem {
    return this.currentHistoryItem;
  }

  /**
   * Handles a new state-store command message.
   * - create a new history item from the new command message.
   * - increases the free history message number.
   * - adds the history item to history queue.
   *
   * @param  {KrixStateStore.Interfaces.StoreCommand} message
   * @return {void}
   */
  onMessage (
    message: KrixStateStore.Interfaces.StoreCommand,
  ): void {
    if (message.name !== KrixStateStore.Enums.StoreCommandName.SetState) {
      return;
    }

    const historyItem: Interfaces.HistoryItem = _.assign({
      id: this.freeHistoryMessageNumber,
    }, message.data);
    this.freeHistoryMessageNumber += 1;

    this.historyList.push(historyItem);

    // FYI: If we subtract 1, we get the last element in the queue but the last element is the new element
    // so we subtract 2 and get the previous last element (when the queue was without the new element).
    // If the current history item index is the previous last element we will move selector to the next
    // element.
    if (this.historyList.length - 2 === this.currentHistoryItemIndex) {
      this.goToNextDirection(1);
      this.currentHistoryItemIndex += 1;
      this.currentHistoryItem = this.historyList[this.currentHistoryItemIndex];
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
    const newCurrentHistoryItemIndex = _.findIndex(this.historyList, [ 'id', newCurrentHistoryItemId ]);
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
    this.currentHistoryItem = this.historyList[newCurrentHistoryItemIndex];

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
      const nextHistoryItem = this.historyList[nextHistoryItemIndex];

      if (nextHistoryItem?.options?.signal === true) {
        continue;
      }

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
      const prevHistoryItem = this.historyList[prevHistoryItemIndex];

      if (prevHistoryItem?.options?.signal === true) {
        continue;
      }

      this.krixStateStore.setState({
        state: prevHistoryItem.state,
        value: prevHistoryItem.oldValue,
      });
    }

    const newCurrentHistoryItemIndex = this.currentHistoryItemIndex - stepsCount;
    const newCurrentHistoryItem = this.historyList[newCurrentHistoryItemIndex];

    if (newCurrentHistoryItem?.options?.signal === true) {
      return;
    }

    this.krixStateStore.setState({
      state: newCurrentHistoryItem.state,
      value: newCurrentHistoryItem.newValue,
    });
  }
}
