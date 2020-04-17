import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { StateTreeNodeComponent } from './components/state-tree-node/state-tree-node.component';

// pipes
import { ForOfPipe } from './pipes/for-of.pipe';

const pipes = [ForOfPipe];

const components = [
  StateTreeNodeComponent,
];

@NgModule({
  declarations: [
    ...pipes,
    ...components],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    ...pipes,
    ...components,
  ],
})
export class SharedModule { }
