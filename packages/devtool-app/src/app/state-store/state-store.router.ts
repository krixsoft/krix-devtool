import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components
import { StateTreeComponent } from './pages/state-tree/state-tree.component';
import { StateStoreComponent } from './components/state-store/state-store.component';

const routes: Routes = [{
  path: 'state-store',
  component: StateStoreComponent,
  children: [
    {
      path: '',
      component: StateTreeComponent,
    },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class StateStoreRouter { }
