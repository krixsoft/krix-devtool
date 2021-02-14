import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { BaseComponent } from '../../../../shared/base.component';

import { StateStoreArbiter } from '../../../core/ss.arbiter';

@Component({
  selector: 'krix-store-selector',
  templateUrl: './store-selector.html',
})
export class StoreSelectorComponent extends BaseComponent implements OnInit {
  public stateStoresNames: string[];
  public selectedStateStore: string;

  set fcSelectedStateStoreName (value: string) {
    this.selectedStateStore = value;
    this.ssArbiter.setActiveStore(value);
  }
  get fcSelectedStateStoreName (): string {
    return this.selectedStateStore;
  }

  constructor (
    private ssArbiter: StateStoreArbiter,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();

    this.changeDetection.detach();
  }

  ngOnInit (): void {
    const ssMessageHandler$ = this.ssArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.subscribe(ssMessageHandler$);
    this.updateView();
  }

  updateView (
  ): void {
    this.stateStoresNames = this.ssArbiter.getStoreNames();
    this.selectedStateStore = this.ssArbiter.getActiveStoreName();
    this.changeDetection.detectChanges();
  }
}
