import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Core from '@krix-devtool/core';

import { Environment } from '../../../../environments/environment';
import { BaseComponent } from '../../../shared/base.component';

// Services
import { MessageHandler } from '../../../core/data-flow';
import { StateStoreMessageHandler } from './../../core/ss-message-handler';
import { StateStoreDemoService } from '../../demo/state-store-demo.service';

@Component({
  selector: 'krix-state-store-tab',
  templateUrl: './state-store-tab.html',
})
export class StateStoreTabComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor (
    private stateStoreDemoService: StateStoreDemoService,
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

    if (Environment.production === false) {
      this.stateStoreDemoService.startEmulator();
    }
  }

  ngOnDestroy (
  ): void {
    super.ngOnDestroy();

    if (Environment.production === false) {
      this.stateStoreDemoService.stopEmulator();
    }
  }
}
