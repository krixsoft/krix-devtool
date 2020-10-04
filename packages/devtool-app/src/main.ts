/// <reference types="chrome"/>
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Environment } from './environments/environment';

import './libs';

if (Environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((error) => {
    console.error(error);
  });
