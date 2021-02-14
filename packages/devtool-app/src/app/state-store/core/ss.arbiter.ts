import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';

import { MessageService } from '../../core/message.service';

@Injectable()
export class StateStoreArbiter {
  private storeNames: string[];
  private activeStore: string;

  private sjNotif: Subject<null>;

  constructor (
    private messageService: MessageService,
  ) {
    this.sjNotif = new Subject();
    this.storeNames = [];
    this.activeStore = null;
  }

  /**
   * Creates an observable object which gets DTA commands.
   *
   * @return {Observable<Core.Interfaces.EndpointMessage>}
   */
  getObserver (
  ): Observable<Core.Interfaces.EndpointMessage> {
    return this.sjNotif.asObservable();
  }

  /**
   * Returns the list of state stores.
   *
   * @return {string[]}
   */
  getStoreNames (
  ): string[] {
    return this.storeNames;
  }

  /**
   * Sets the list of state stores.
   *
   * @return {void}
   */
  setStoreNames (
    storeNames: string[],
  ): void {
    this.storeNames = storeNames;
    if (_.isEmpty(this.storeNames) === true) {
      this.activeStore = null;
      this.sjNotif.next(null);
      return;
    }

    const activeStoreIsLive = _.includes(this.storeNames, this.activeStore);
    if (activeStoreIsLive === true) {
      this.sjNotif.next(null);
      return;
    }

    const firstStore = _.head(this.storeNames);
    this.setActiveStore(firstStore);
    this.sjNotif.next(null);
  }

  /**
   * Sets the new active store.
   *
   * @param  {string} store
   * @return {void}
   */
  setActiveStore (
    storeName: string,
  ): void {
    if (this.activeStore === storeName) {
      return;
    }

    this.activeStore = storeName;
    this.messageService.getStateStore(this.activeStore);
  }

  /**
   * Returns the active store name.
   *
   * @return {string}
   */
  getActiveStoreName (
  ): string {
    return this.activeStore;
  }
}
