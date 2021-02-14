import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

// Services
import { SettingsService } from '../../core/settings.service';

import { Interfaces } from '../shared';

@Injectable()
export class StateStoreHistoryService {
  private krixStateStore: KrixStateStore.StateStore;

  /**
   * The list of all history items.
   */
  private historyList: Interfaces.HistoryItem[];

  /**
   * Filtered history list by the current search criteria.
   */
  private filteredHistoryList: Interfaces.HistoryItem[];
  /**
   * We use this field as the current search criteria.
   */
  private searchText: string;
  /**
   * The regular expression which correspond the current search criteria.
   */
  private searchRgx: RegExp;

  /**
   * The index of the selected history item.
   */
  private currentHistoryItemIndex: number;
  /**
   * The selected history item.
   */
  private currentHistoryItem: Interfaces.HistoryItem;
  /**
   * `true` if the selected history item is the last element.
   */
  public currentHistoryItemIsLastItem: boolean;

  /**
   * RxJS subject which we use to notify an external logic about changes.
   */
  private sjHistoryChange: Subject<null>;

  /**
   * Uniq history message number - the identifier of the next new history item.
   */
  private freeHistoryMessageNumber: number;

  constructor (
    private settingsService: SettingsService,
  ) {
    this.sjHistoryChange = new Subject();

    const krixStateStore = KrixStateStore.StateStore.create();
    this.setStore(krixStateStore);
  }

  /**
   * Sets a new state-store and resets all internal states.
   *
   * @param  {KrixStateStore.StateStore} krixStateStore
   * @return {void}
   */
  setStore (
    krixStateStore: KrixStateStore.StateStore,
  ): void {
    if (krixStateStore === this.krixStateStore) {
      return;
    }

    this.krixStateStore = krixStateStore;
    this.historyList = [];

    this.currentHistoryItemIndex = -1;
    this.currentHistoryItemIsLastItem = true;
    this.freeHistoryMessageNumber = 0;

    this.searchText = null;
    this.setFilter('');
    this.sjHistoryChange.next(null);
  }

  /**
   * Sets a new search text and recalculates the history list.
   *
   * @param  {string} searchText
   * @return {void}
   */
  setFilter (
    searchText: string,
  ): void {
    if (this.searchText === searchText) {
      return;
    }

    if (_.isEmpty(searchText) === true) {
      this.searchText = '';
      this.filteredHistoryList = [ ...this.historyList ];
    } else {
      this.searchText = searchText;
      const escapedsearchString = _.replace(searchText, /[.*+\-?^${}()|[\]\\]/g, '\\$&');
      this.searchRgx = new RegExp(escapedsearchString, 'i');

      this.filteredHistoryList = _.filter(this.historyList, (historyItem) => {
        return this.compareHistoryItemWithSearchText(historyItem);
      });
    }

    this.currentHistoryItemIndex = this.filteredHistoryList.length - 1;
    this.currentHistoryItem = this.currentHistoryItemIndex === -1
      ? null : this.filteredHistoryList[this.currentHistoryItemIndex];

    this.sjHistoryChange.next(null);
  }

  /**
   * Compares the history item with search text. Returns `true` if the match succeeds.
   *
   * @param  {Interfaces.HistoryItem} historyItem
   * @return {boolean}
   */
  private compareHistoryItemWithSearchText (
    historyItem: Interfaces.HistoryItem,
  ): boolean {
    if (_.isEmpty(this.searchText) === true) {
      return true;
    }

    const matchArr = this.searchRgx.exec(historyItem.statePath);
    return _.isNil(matchArr) === false;
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
    return [ ...this.filteredHistoryList ];
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

    let emitUpdate = false;
    // Don't add a new item to the filtered list if it doesn't fit the search text
    if (this.compareHistoryItemWithSearchText(historyItem) === true) {
      this.filteredHistoryList.push(historyItem);
      emitUpdate = true;
    }

    let removedItem: Interfaces.HistoryItem = null;
    // Remove the first item from the history list if history list is full
    if (this.settingsService.stateStoreHistorySize === this.historyList.length - 1) {
      removedItem = this.historyList.shift();
    }

    // Handle the case when the removed item is the first item of filtered list
    if (_.isNil(removedItem) === false && removedItem.id === this.filteredHistoryList[0]?.id) {
      if (removedItem.id === this.currentHistoryItem?.id) {
        // Move the pointer to the next item if the removed is the current item
        this.goToNextDirection(1);
      } else {
        // Move the pointer to the previous item if the removed isn't the current item.
        // FYI: Fn removes the first item from the filtered list (filtered list is an array) so it shifts
        // all indexes in the array.
        this.currentHistoryItemIndex -= 1;
      }

      this.filteredHistoryList.shift();
      emitUpdate = true;
    }

    // FYI: If we subtract 1, we get the last element in the queue but the last element is the new element
    // so we subtract 2 and get the previous last element (when the queue was without the new element).
    // If the current history item index is the previous last element we will move selector to the next
    // element.
    if (this.filteredHistoryList.length - 2 === this.currentHistoryItemIndex) {
      this.goToNextDirection(1);
      this.currentHistoryItemIndex += 1;
      emitUpdate = true;
    }

    this.currentHistoryItem = this.filteredHistoryList[this.currentHistoryItemIndex];

    if (emitUpdate === true) {
      this.sjHistoryChange.next(null);
    }
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
    const newCurrentHistoryItemIndex = _.findIndex(this.filteredHistoryList, [ 'id', newCurrentHistoryItemId ]);
    if (newCurrentHistoryItemIndex === this.currentHistoryItemIndex) {
      return;
    }

    this.currentHistoryItemIsLastItem = newCurrentHistoryItemIndex === (this.filteredHistoryList.length - 1);

    if (newCurrentHistoryItemIndex > this.currentHistoryItemIndex) {
      const stepsCount = newCurrentHistoryItemIndex - this.currentHistoryItemIndex;
      this.goToNextDirection(stepsCount);
    } else {
      const stepsCount = this.currentHistoryItemIndex - newCurrentHistoryItemIndex;
      this.goToPrevDirection(stepsCount);
    }

    this.currentHistoryItemIndex = newCurrentHistoryItemIndex;
    this.currentHistoryItem = this.filteredHistoryList[newCurrentHistoryItemIndex];

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
      const nextHistoryItem = this.filteredHistoryList[nextHistoryItemIndex];

      if (_.isNil(nextHistoryItem) === true) {
        return;
      }

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
      const prevHistoryItem = this.filteredHistoryList[prevHistoryItemIndex];

      if (prevHistoryItem?.options?.signal === true) {
        continue;
      }

      this.krixStateStore.setState({
        state: prevHistoryItem.state,
        value: prevHistoryItem.oldValue,
      });
    }

    const newCurrentHistoryItemIndex = this.currentHistoryItemIndex - stepsCount;
    const newCurrentHistoryItem = this.filteredHistoryList[newCurrentHistoryItemIndex];

    if (newCurrentHistoryItem?.options?.signal === true) {
      return;
    }

    this.krixStateStore.setState({
      state: newCurrentHistoryItem.state,
      value: newCurrentHistoryItem.newValue,
    });
  }
}
