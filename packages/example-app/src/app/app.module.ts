import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// --- Modules

// --- Components
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
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
