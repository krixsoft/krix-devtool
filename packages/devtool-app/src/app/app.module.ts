import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// --- Routers
import { AppRouter } from './app.router';

// --- Modules
import { StateStoreModule } from './state-store/state-store.module';
import { CoreModule } from './core/core.module';

// --- Components
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, CoreModule, StateStoreModule, SharedModule, AppRouter],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
