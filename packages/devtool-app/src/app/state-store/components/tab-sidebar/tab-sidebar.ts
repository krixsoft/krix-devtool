import { Component, OnInit, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../shared/base.component';

@Component({
  selector: 'krix-tab-sidebar',
  templateUrl: './tab-sidebar.html',
})
export class TabSidebarComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor (
  ) {
    super();
  }

  ngOnInit (): void {
  }
}
