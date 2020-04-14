import { Subscription } from 'rxjs';
import { HistoryService } from './../../core/services/history.service';
import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'krix-state-tree',
  templateUrl: './state-tree.component.html',
})
export class StateTreeComponent implements OnInit {
  public state: any = {};
  public sjStoreChange: Subscription;

  constructor (private historyService: HistoryService) { }

  ngOnInit (): void {
    this.state = this.historyService.getStore();

    this.sjStoreChange = this.historyService
      .getStoreObserver()
      .subscribe(() => {
        this.state = this.historyService.getStore();
      });
  }

}
