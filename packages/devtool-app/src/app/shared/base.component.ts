import type { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export class BaseComponent implements OnDestroy {
  private subscription: Set<Subscription>;

  constructor () {
    this.subscription = new Set();
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  ngOnDestroy (
  ): void {
    this.subscription.forEach((data) => {
      if (data === null || typeof data.unsubscribe !== 'function') {
        return;
      }

      data.unsubscribe();
    });
    this.subscription.clear();
  }

  /**
   * Adds a subscription to subsciption list.
   *
   * @param {Subscription} sub
   * @return {void}
   */
  subscribe (
    sub: Subscription,
  ): void {
    this.subscription.add(sub);
  }
}
