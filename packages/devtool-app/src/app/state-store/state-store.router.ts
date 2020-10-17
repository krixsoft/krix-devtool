import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components
import { StateStoreTabComponent } from './components/state-store-tab/state-store-tab';
import { StoreViewPageComponent } from './components/tab-content/store-view-page/store-view-page';
import { CommandViewPageComponent } from './components/tab-content/command-view-page/command-view-page';

const routes: Routes = [{
  path: 'state-store',
  component: StateStoreTabComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'store',
    },
    {
      path: 'store',
      component: StoreViewPageComponent,
    },
    {
      path: 'command',
      component: CommandViewPageComponent,
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
