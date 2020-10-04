import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components
import { StateStoreTabComponent } from './components/state-store-tab/state-store-tab';
import { StorePageComponent } from './components/tab-content/store-page/store-page';

const routes: Routes = [{
  path: 'state-store',
  component: StateStoreTabComponent,
  children: [
    {
      path: '',
      component: StorePageComponent,
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
