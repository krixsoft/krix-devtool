import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// --- Modules
import { StateStoreModule } from './state-store/state-store.module';

// --- Components
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StateStoreModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
