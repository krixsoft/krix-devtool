import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { BaseComponent } from '../../../../shared/base.component';

import { StateStoreHistoryService } from '../../../core/ss-history.service';
import { StateStoreMessageHandler } from '../../../core/ss-message-handler';

@Component({
  selector: 'krix-store-selector',
  templateUrl: './store-selector.html',
})
export class StoreSelectorComponent extends BaseComponent implements OnInit {
  public stateStoresNames: string[];

  private selectedStateStoreName: string;
  set vSelectedStateStoreName (value: string) {
    console.log(value);
    this.selectedStateStoreName = value;
  }
  get vSelectedStateStoreName (): string {
    return this.selectedStateStoreName;
  }

  constructor (
    private ssHistoryService: StateStoreHistoryService,
    private ssMessageHandler: StateStoreMessageHandler,
    private changeDetection: ChangeDetectorRef,
  ) {
    super();

    this.changeDetection.detach();
  }

  ngOnInit (): void {
    const ssMessageHandler$ = this.ssMessageHandler.getCommandObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.subscribe(ssMessageHandler$);
    this.updateView();
  }

  updateView (
  ): void {
    this.stateStoresNames = this.ssMessageHandler.getStateStoresNames();
    this.changeDetection.detectChanges();
  }
}
