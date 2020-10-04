import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import * as KrixStateStore from '@krix/state-store';

import { BaseComponent } from '../../../shared/base.component';
import * as Shared from '../../../shared';

import { HistoryService } from '../../core/history.service';

@Component({
  selector: 'krix-state-tree',
  templateUrl: './state-tree.component.html',
})
export class StateTreeComponent extends BaseComponent implements OnInit {
  public stateStore: KrixStateStore.StateStore;
  public store: unknown;

  public sjStoreChange: Subscription;

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
    this.store = this.lodash.assign({}, store);
    this.changeDetection.detectChanges();
  }
}
