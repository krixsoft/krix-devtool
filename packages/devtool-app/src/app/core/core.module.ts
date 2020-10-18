import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Services
import {
  EndpointConnector,
  MessageRetranslator,
  MessageHandler,
} from './data-flow';
import { SettingsService } from './settings.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    EndpointConnector,
    MessageRetranslator,
    MessageHandler,
    SettingsService,
  ],
})
export class CoreModule { }
