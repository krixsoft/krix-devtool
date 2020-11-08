import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Services
import {
  EndpointConnector,
  MessageRetranslator,
  MessageHandler,
} from './data-flow';
import { MessageService } from './message.service';
import { SettingsService } from './settings.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    EndpointConnector,
    MessageRetranslator,
    MessageHandler,
    MessageService,
    SettingsService,
  ],
})
export class CoreModule { }
