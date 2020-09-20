import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import * as _ from 'lodash';

import * as Shared from '../../../shared';

import { BaseComponent } from '../../../shared/base.component';

import { HistoryService } from '../../core/history.service';
import { Interfaces } from '../../shared';

@Component({
  selector: 'krix-state-store-sidebar',
  templateUrl: './state-store-sidebar.component.html',
})
export class StateStoreSidebarComponent extends BaseComponent implements OnInit, OnDestroy {
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

  constructor (
    @Inject(Shared.Constants.DI.Lodash)
    private readonly lodash: Shared.Interfaces.Pkg.Lodash,
    private historyService: HistoryService,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();
    this.changeDetection.detach();
  }

  ngOnInit (): void {
    super.ngOnInit();

    this.historyService.getHistoryChangeObserver()
      .subscribe(() => {
        this.updateView();
      });
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
      const lastHistoryItem = this.lodash.last(this.historyItems);
      this.historyService.goToHistoryItem(lastHistoryItem?.id);
    } else {
      this.historyService.goToHistoryItem(newHistoryItemId);
    }

    this.currentHistoryItem = this.historyService.getCurrentHistoryItem();
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
    this.historyItems = this.historyService.getHistory();
    this.currentHistoryItem = this.historyService.getCurrentHistoryItem();
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
    this.filteredHistoryItems = this.lodash.filter(this.historyItems, (command) => {
      const result = rgxFilterValue.exec(command.statePath);
      return !_.isNil(result) && !_.isUndefined(result[0]);
    });
  }
}
