import { SharedModule } from './shared/shared.module';
import { StateStoreViewRouter } from './state-store-view/state-store-view.router';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateStoreComponent } from './state-store.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StateStoreHistory } from './state-store-history/state-store-history.component';
import { StateStoreView } from './state-store-view/state-store-view.component';
import { StateTreeComponent } from './state-store-view/state-tree/state-tree.component';

@NgModule({
  declarations: [
    StateStoreComponent,
    StateStoreHistory,
    StateStoreView,
    StateTreeComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    StateStoreViewRouter,
  ],
  exports: [StateStoreComponent],
})
export class StateStoreModule { }
