import type { Subscription } from 'rxjs';

export class BaseManager {
  private subscription: Set<Subscription>;

  constructor () {
    this.subscription = new Set();
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  protected stopAllSubscriptions (
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
  protected subscribe (
    sub: Subscription,
  ): void {
    this.subscription.add(sub);
  }
}
