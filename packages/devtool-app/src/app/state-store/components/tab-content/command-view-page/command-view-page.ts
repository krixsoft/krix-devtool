import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

import { BaseComponent } from '../../../../shared/base.component';

import { Interfaces } from '../../../shared';
import { HistoryService } from '../../../core/history.service';

@Component({
  selector: 'krix-command-view-page',
  templateUrl: './command-view-page.html',
})
export class CommandViewPageComponent extends BaseComponent implements OnInit {
  public stateStore: KrixStateStore.StateStore;
  public currentHistoryItem: Interfaces.HistoryItem;

  public sjStoreChange: Subscription;

  constructor (
    private historyService: HistoryService,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();

    this.changeDetection.detach();
  }

  ngOnInit (): void {
    this.stateStore = this.historyService.getStateStore();

    const sjHistoryChange = this.historyService
      .getHistoryChangeObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.subscribe(sjHistoryChange);
    this.updateView();
  }

  updateView (
  ): void {
    const currentHistoryItem = this.historyService.getCurrentHistoryItem();
    this.currentHistoryItem = _.clone(currentHistoryItem);
    this.changeDetection.detectChanges();
  }
}
