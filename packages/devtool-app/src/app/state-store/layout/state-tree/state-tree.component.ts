import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { HistoryService } from '../../core/history.service';

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
        this.state = _.assign({}, this.historyService.getStore());
      });
  }

}
