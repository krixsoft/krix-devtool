import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from './core/core.module';
import { SharedModule } from './../shared/shared.module';

import { StateTreeNodeComponent } from './state-store-view/state-tree/state-tree-node/state-tree-node.component';
import { StateStoreComponent } from './state-store.component';
import { StateStoreHistory } from './state-store-history/state-store-history.component';
import { StateStoreView } from './state-store-view/state-store-view.component';
import { StateTreeComponent } from './state-store-view/state-tree/state-tree.component';

@NgModule({
  declarations: [
    StateStoreComponent,
    StateStoreHistory,
    StateStoreView,
    StateTreeComponent,
    StateTreeNodeComponent,
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
