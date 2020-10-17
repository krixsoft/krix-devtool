import { Component, OnInit } from '@angular/core';

import * as Core from '@krix-devtool/core';

import { BaseComponent } from '../../../shared/base.component';
import { MessageHandler } from '../../../core/data-flow';
import { StateStoreMessageHandler } from './../../core/ss-message-handler';

@Component({
  selector: 'krix-state-store-tab',
  templateUrl: './state-store-tab.html',
})
export class StateStoreTabComponent extends BaseComponent implements OnInit {
  constructor (
    private messageHandler: MessageHandler,
    private ssMessageHandler: StateStoreMessageHandler,
  ) {
    super();
  }

  ngOnInit (): void {
    const packageCommand$ = this.messageHandler.getCommandObserver()
      .subscribe((message) => {
        if (message.payload.packageName !== Core.Enums.PackageName.StateStore) {
          return;
        }

        this.ssMessageHandler.onMessage(message);
      });
    this.subscribe(packageCommand$);
  }
}
