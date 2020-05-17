import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';

import * as Shared from '../shared';

// --- Services
import {
  EndpointConnector,
  MessageRetranslator,
} from './services';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    EndpointConnector,
    MessageRetranslator,
    {
      provide: Shared.Constants.DI.Lodash,
      useValue: _,
    },
  ],
})
export class CoreModule { }
