import { StateTreeComponent } from './state-store/layout/state-tree/state-tree.component';
import { StateStoreComponent } from './state-store/state-store.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: StateStoreComponent,
  children: [
    {
      path: '',
      component: StateTreeComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouter { }
