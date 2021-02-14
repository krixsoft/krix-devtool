import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// --- Components
import { SettingsComponent } from './settings.component';

const routes: Routes = [{
  path: 'settings',
  component: SettingsComponent,
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SettingsRouter { }
