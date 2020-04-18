import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from './core/core.module';
import { SharedModule } from './../shared/shared.module';

// components
import { StateStoreComponent } from './state-store.component';
import { StateStoreHistoryComponent } from './state-store-history/state-store-history.component';
import { StateStoreViewComponent } from './state-store-view/state-store-view.component';
import { StateTreeComponent } from './layout/state-tree/state-tree.component';

@NgModule({
  declarations: [
    StateStoreComponent,
    StateStoreHistoryComponent,
    StateStoreViewComponent,
    StateTreeComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    SharedModule,
    RouterModule,
    FontAwesomeModule,
  ],
  exports: [StateStoreComponent],
})
export class StateStoreModule { }
