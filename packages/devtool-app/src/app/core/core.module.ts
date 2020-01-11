import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';

import * as Shared from '../shared';

// --- Services
import {
  MessageRetranslatorService,
} from './services';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    MessageRetranslatorService,
    {
      provide: Shared.Constants.DI.Lodash,
      useValue: _,
    },
  ],
})
export class CoreModule { }
