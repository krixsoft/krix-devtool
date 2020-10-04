import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

import { BaseComponent } from '../../../../shared/base.component';

import { HistoryService } from '../../../core/history.service';

@Component({
  selector: 'krix-store-page',
  templateUrl: './store-page.html',
})
export class StorePageComponent extends BaseComponent implements OnInit {
  public stateStore: KrixStateStore.StateStore;
  public store: unknown;

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
    const store = this.stateStore.getState();
    this.store = _.clone(store);
    this.changeDetection.detectChanges();
  }
}
