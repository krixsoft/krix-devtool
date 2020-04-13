import { HistoryService } from './services/history.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  providers: [HistoryService],
  exports: [],
})
export class CoreModule {

}
