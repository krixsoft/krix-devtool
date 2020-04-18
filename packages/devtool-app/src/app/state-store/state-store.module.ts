import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

// --- Components
import { StateStoreComponent } from './state-store.component';
import { StateStoreHistoryComponent } from './state-store-history/state-store-history.component';
import { StateStoreViewComponent } from './state-store-view/state-store-view.component';
import { StateTreeComponent } from './layout/state-tree/state-tree.component';

// --- Services
import { HistoryService } from './core/history.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    StateStoreComponent,
    StateStoreHistoryComponent,
    StateStoreViewComponent,
    StateTreeComponent,
  ],
  providers: [
    HistoryService,
  ],
  exports: [StateStoreComponent],
})
export class StateStoreModule { }
