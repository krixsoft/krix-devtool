import { Component, OnInit } from '@angular/core';

import * as Core from '@krix-devtool/core';

import { BaseComponent } from '../../../shared/base.component';
import { HistoryService } from '../../core/history.service';
import { MessageHandler } from '../../../core/data-flow';

@Component({
  selector: 'krix-state-store',
  templateUrl: './state-store.component.html',
})
export class StateStoreComponent extends BaseComponent implements OnInit {
  constructor (
    private historyService: HistoryService,
    private messageHandler: MessageHandler,
    ) {
    super();
  }

  ngOnInit (): void {
    const packageCommand$ = this.messageHandler.getPackageCommandObserver()
      .subscribe((message) => {
        if (message.packageName !== Core.Enums.PackageName.StateStore) {
          return;
        }

        this.historyService.onMessage(message.command);
      });
    this.subscribe(packageCommand$);
  }
}
