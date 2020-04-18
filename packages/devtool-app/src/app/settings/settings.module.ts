import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Modules
import { SettingsRouter } from './settings.router';
import { SharedModule } from '../shared/shared.module';

// --- Components
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRouter,
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule { }
