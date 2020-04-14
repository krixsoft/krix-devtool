import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForOfPipe } from './pipes/for-of.pipe';

const pipes = [ForOfPipe];

@NgModule({
  declarations: [...pipes],
  imports: [
    CommonModule,
  ],
  exports: [
    ...pipes,
  ],
})
export class SharedModule { }
