import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';

import { BaseComponent } from '../../../../shared/base.component';
import * as SharedInterfaces from '../../../../shared/interfaces';

import { StateStoreHistoryService } from '../../../core/ss-history.service';
import { Interfaces } from '../../../shared';

@Component({
  selector: 'krix-store-history',
  templateUrl: './store-history.html',
})
export class StoreHistoryComponent extends BaseComponent implements OnInit, OnDestroy {
  public historyItems: Interfaces.HistoryItem[];
  public currentHistoryItem: Interfaces.HistoryItem;
  public currentHistoryItemIsLastItem: boolean;

  public faStripeS = faStripeS;

  private commandFilterValue: string = '';
  set inputCommandFilterValue (value: string) {
    this.commandFilterValue = value;
    this.ssHistoryService.setFilter(value);
    this.changeDetection.detectChanges();
  }
  get inputCommandFilterValue (): string {
    return this.commandFilterValue;
  }

  constructor (
    private ssHistoryService: StateStoreHistoryService,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();
    this.changeDetection.detach();
  }

  ngOnInit (): void {
    this.ssHistoryService.getHistoryChangeObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.updateView();
  }

  /**
   * Handles "Delegate Click" events from the history list.
   * - changes the current history item.
   * - updates the current history item.
   *
   * @event  {DelegateClick}
   * @param  {SharedInterfaces.ClickDelegateEvent} event
   * @return {void}
   */
  onClickChangeHistoryItem (
    event: SharedInterfaces.ClickDelegateEvent,
  ): void {
    const newHistoryItemId = +event.id;

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

    this.currentHistoryItemIsLastItem = this.ssHistoryService.currentHistoryItemIsLastItem;

    this.changeDetection.detectChanges();
  }
}
