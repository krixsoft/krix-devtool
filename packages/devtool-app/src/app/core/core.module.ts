import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Services
import {
  EndpointConnector,
  MessageRetranslator,
  MessageHandler,
} from './data-flow';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    EndpointConnector,
    MessageRetranslator,
    MessageHandler,
  ],
})
export class CoreModule { }
