import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { StateStoreRouter } from './state-store.router';

// --- Components
import { StateStoreComponent } from './components/state-store/state-store.component';
import { StateStoreSidebarComponent } from './components/state-store-sidebar/state-store-sidebar.component';
import { StateStoreViewComponent } from './components/state-store-view/state-store-view.component';
import { StateTreeComponent } from './pages/state-tree/state-tree.component';

// --- Services
import { HistoryService } from './core/history.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    StateStoreRouter,
  ],
  declarations: [
    StateStoreComponent,
    StateStoreSidebarComponent,
    StateStoreViewComponent,
    StateTreeComponent,
  ],
  providers: [
    HistoryService,
  ],
  exports: [StateStoreComponent],
})
export class StateStoreModule { }
