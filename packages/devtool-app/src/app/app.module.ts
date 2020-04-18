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
import { AppNavigationComponent } from './components/app-navigation/app-navigation.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    StateStoreModule,
    AppRouter,
  ],
  declarations: [
    AppComponent,
    AppNavigationComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
