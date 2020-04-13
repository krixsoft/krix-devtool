import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import * as _ from 'lodash';
import * as Krix from '@krix/state-store';

import { HistoryService } from '../core/services/history.service';
@Component({
  selector: 'krix-history',
  templateUrl: './state-store-history.component.html',
})
export class StateStoreHistory implements OnInit, OnDestroy {
  private stateChanges: Krix.Interfaces.StoreChange[] = [];
  public filteredStateChanges: Krix.Interfaces.StoreChange[];
  public store: any = {};
  public selectedStateChangeNumber: number;

  public faStripeS = faStripeS;

  public sjStoreChange: Subscription;
  public sjStateChangesChange: Subscription;
  public sjCurrentStateChangeNumberChange: Subscription;

  private _stateChangeFilter: string = '';

  @Input() set stateChangeFilter (value: string) {
    this._stateChangeFilter = value;
    this.filterStateChanges(value);
  }

  get stateChangeFilter (): string {
    return this._stateChangeFilter;
  }

  constructor (private historyService: HistoryService) { }

  ngOnInit (): void {
    this.stateChanges = this.historyService.getStateChanges();
    this.selectedStateChangeNumber = this.historyService.getCurrentStateChangeNumber();

    this.sjStoreChange = this.historyService
      .getStoreObserver()
      .subscribe(() => {
        this.store = this.historyService.getStore();
      });

    this.sjStateChangesChange = this.historyService
      .getStateChangesObserver()
      .subscribe(() => {
        this.stateChanges = this.historyService.getStateChanges();
        this.filterStateChanges(this.stateChangeFilter);
      });

    this.sjCurrentStateChangeNumberChange = this.historyService
      .getCurrentStateChangeNumberObserver()
      .subscribe(() => {
        this.selectedStateChangeNumber = this.historyService.getCurrentStateChangeNumber();
      });

    this.filteredStateChanges = _.concat([], this.stateChanges);
  }

  ngOnDestroy () {
    this.sjStoreChange.unsubscribe();
    this.sjStateChangesChange.unsubscribe();
    this.sjCurrentStateChangeNumberChange.unsubscribe();
  }

  onClickSelectStateChange (event: MouseEvent): void {
    const el = event.target as HTMLElement;
    const liEl = el.closest('li');
    const stateChangeNumber = +liEl.dataset.id;
    this.historyService.goToStateChange(stateChangeNumber);
    this.selectedStateChangeNumber = this.historyService.getCurrentStateChangeNumber();
  }

  filterStateChanges (value: string): void {
    const filteredStateChanges = this.stateChanges.filter((stateChange) => {
      return stateChange.statePath.includes(value);
    });
    this.filteredStateChanges = filteredStateChanges;
  }
}
