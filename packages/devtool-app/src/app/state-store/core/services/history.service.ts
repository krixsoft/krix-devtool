import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as Krix from '@krix/state-store';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class HistoryService {
  public stateChanges: Krix.Interfaces.StoreChange[] = [];
  public currentStateChangeNumber: number = 0;
  public currentStateChange: any;
  public store: any = {};

  public sjStoreChange = new Subject<null>();
  public sjStateChangesChange = new Subject<null>();
  public sjCurrentStateChangeChange = new Subject<null>();
  public sjCurrentStateChangeNumberChange = new Subject<null>();

  constructor () { }

  getStore (): any {
    return this.store;
  }

  getCurrentStateChangeNumber (): number {
    return this.currentStateChangeNumber;
  }

  getCurrentStateChange (): Krix.Interfaces.StoreChange {
    return this.currentStateChange;
  }

  getStateChanges (): Krix.Interfaces.StoreChange[] {
    return this.stateChanges;
  }

  getStoreObserver (): Observable<null> {
    return this.sjStoreChange.asObservable();
  }

  getStateChangesObserver (): Observable<null> {
    return this.sjStateChangesChange.asObservable();
  }

  getCurrentStateChangeObserver (): Observable<null> {
    return this.sjCurrentStateChangeChange.asObservable();
  }

  getCurrentStateChangeNumberObserver (): Observable<null> {
    return this.sjCurrentStateChangeNumberChange.asObservable();
  }

  addStateChange (stateChange: Krix.Interfaces.StoreChange): void {
    const stateChagneWithId = _.assign(
      { id: this.stateChanges.length },
      stateChange,
    );
    this.stateChanges.push(stateChagneWithId);
    if (this.currentStateChangeNumber === this.stateChanges.length - 2) {
      this.currentStateChangeNumber += 1;
      _.set(
        this.store,
        stateChagneWithId.statePath,
        stateChagneWithId.newValue,
      );
      this.currentStateChange = this.stateChanges[
        this.currentStateChangeNumber
      ];

      this.sjCurrentStateChangeNumberChange.next(null);
      this.sjCurrentStateChangeChange.next(null);
      this.sjStoreChange.next(null);
    }
    this.sjStateChangesChange.next(null);
  }

  goToStateChange (stateChangeNumber: number): void {
    if (stateChangeNumber === this.currentStateChangeNumber) {
      return;
    }

    const direction =
      stateChangeNumber > this.currentStateChangeNumber ? 1 : -1;

    if (this.currentStateChangeNumber === -1) {
      this.currentStateChangeNumber = 0;
    }

    while (this.currentStateChangeNumber !== stateChangeNumber) {
      const stateChange = this.stateChanges[this.currentStateChangeNumber];
      const stateValue =
        direction === 1 ? stateChange.newValue : stateChange.oldValue;
      _.set(this.store, stateChange.statePath, stateValue);
      this.currentStateChangeNumber += direction;
      this.currentStateChange = this.stateChanges[
        this.currentStateChangeNumber
      ];
    }

    if (direction === 1) {
      const stateChange = this.stateChanges[this.currentStateChangeNumber];
      _.set(this.store, stateChange.statePath, stateChange.newValue);
    }

    this.sjCurrentStateChangeChange.next(null);
    this.sjCurrentStateChangeNumberChange.next(null);
    this.sjStoreChange.next(null);
  }
}
