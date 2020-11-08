import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { StateStoreRouter } from './state-store.router';
import { StateStoreDemoModule } from './demo/state-store-demo.module';

// --- Components
import { StateStoreTabComponent } from './components/state-store-tab/state-store-tab';

import { TabSidebarComponent } from './components/tab-sidebar/tab-sidebar';
import { StoreSelectorComponent } from './components/tab-sidebar/store-selector/store-selector';
import { StoreHistoryComponent } from './components/tab-sidebar/store-history/store-history';

import { TabContentComponent } from './components/tab-content/tab-content';
import { StoreViewPageComponent } from './components/tab-content/store-view-page/store-view-page';
import { CommandViewPageComponent } from './components/tab-content/command-view-page/command-view-page';

// --- Services
import { StateStoreHistoryService } from './core/ss-history.service';
import { StateStoreMessageHandler } from './core/ss-message-handler';

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
    StoreSelectorComponent,
    StoreHistoryComponent,

    TabContentComponent,
    StoreViewPageComponent,
    CommandViewPageComponent,
  ],
  providers: [
    StateStoreHistoryService,
    StateStoreMessageHandler,
  ],
})
export class StateStoreModule { }
