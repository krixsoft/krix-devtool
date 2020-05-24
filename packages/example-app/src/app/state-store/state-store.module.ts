import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Services
import { StateStore } from './state-store.service';
import { GlobalAction } from './actions/global.action';

// --- Modules

@NgModule({
  imports: [
    BrowserModule,
  ],
  providers: [
    StateStore,
    GlobalAction,
  ],
})
export class StateStoreModule { }
