import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  constructor (
  ) {
  }

  /**
   * Max number of saved history items.
   */
  get stateStoreHistorySize (): number {
    return 100;
  }
}
