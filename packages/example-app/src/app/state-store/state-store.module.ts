import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Services
import { StateStore } from './state-store.service';
import { GlobalStore } from './stores/global.store';

// --- Modules

@NgModule({
  imports: [
    BrowserModule,
  ],
  providers: [
    StateStore,
    GlobalStore,
  ],
})
export class StateStoreModule { }
