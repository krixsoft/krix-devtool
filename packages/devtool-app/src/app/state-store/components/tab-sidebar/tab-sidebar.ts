import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import * as _ from 'lodash';

import { BaseComponent } from '../../../shared/base.component';

// Services
import { StateStoreHistoryService } from '../../core/ss-history.service';

import { Interfaces } from '../../shared';

@Component({
  selector: 'krix-tab-sidebar',
  templateUrl: './tab-sidebar.html',
})
export class TabSidebarComponent extends BaseComponent implements OnInit, OnDestroy {
  public historyItems: Interfaces.HistoryItem[];
  public filteredHistoryItems: Interfaces.HistoryItem[];
  public currentHistoryItem: Interfaces.HistoryItem;

  public faStripeS = faStripeS;

  private commandFilterValue: string = '';
  set inputCommandFilterValue (value: string) {
    this.commandFilterValue = value;
    this.updateFilteredHistoryItems();
    this.changeDetection.detectChanges();
  }
  get inputCommandFilterValue (): string {
    return this.commandFilterValue;
  }

  set inSelectedStore (value: string) {
  }

  constructor (
    private ssHistoryService: StateStoreHistoryService,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();
    this.changeDetection.detach();
  }

  ngOnInit (): void {
    const ssHistoryService$ = this.ssHistoryService.getHistoryChangeObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.subscribe(ssHistoryService$);
    this.updateView();
  }

  /**
   * Handles "Click" events from the history list.
   * - changes the current history item.
   *
   * @event  {MouseClick}
   * @param  {MouseEvent} event
   * @return {void}
   */
  onClickChangeHistoryItem (
    event: MouseEvent,
  ): void {
    const el = event?.target as HTMLElement;
    const liEl = el.closest('li');
    const newHistoryItemId = +liEl?.dataset?.id;

    if (this.currentHistoryItem.id === newHistoryItemId) {
      const lastHistoryItem = _.last(this.historyItems);
      this.ssHistoryService.goToHistoryItem(lastHistoryItem?.id);
    } else {
      this.ssHistoryService.goToHistoryItem(newHistoryItemId);
    }

    this.currentHistoryItem = this.ssHistoryService.getCurrentHistoryItem();
  }

  /**
   * Updates view.
   * - gets the list of new history items;
   * - gets a new current history item;
   * - updates the list of filtered history items.
   *
   * @return {void}
   */
  private updateView (
  ): void {
    this.historyItems = this.ssHistoryService.getHistory();
    this.currentHistoryItem = this.ssHistoryService.getCurrentHistoryItem();
    this.updateFilteredHistoryItems();
    this.changeDetection.detectChanges();
  }

  /**
   * Updates the list of filtered history items.
   *
   * @return {void}
   */
  private updateFilteredHistoryItems (
  ): void {
    const rgxFilterValue = new RegExp(`${this.commandFilterValue}`, 'i');
    this.filteredHistoryItems = _.filter(this.historyItems, (command) => {
      const result = rgxFilterValue.exec(command.statePath);
      return !_.isNil(result) && !_.isUndefined(result[0]);
    });
  }
}
