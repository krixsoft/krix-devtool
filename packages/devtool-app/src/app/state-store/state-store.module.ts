import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { StateStoreRouter } from './state-store.router';
import { StateStoreDemoModule } from './demo/state-store-demo.module';

// --- Components
import { StateStoreTabComponent } from './components/state-store-tab/state-store-tab';

import { TabSidebarComponent } from './components/tab-sidebar/tab-sidebar';
import { StoreHistoryComponent } from './components/tab-sidebar/store-history/store-history';

import { TabContentComponent } from './components/tab-content/tab-content';
import { StorePageComponent } from './components/tab-content/store-page/store-page';

// --- Services
import { HistoryService } from './core/history.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    StateStoreRouter,
    StateStoreDemoModule,
  ],
  declarations: [
    StateStoreTabComponent,

    TabSidebarComponent,
    StoreHistoryComponent,

    TabContentComponent,
    StorePageComponent,
  ],
  providers: [
    HistoryService,
  ],
})
export class StateStoreModule { }
