import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const modules = [
  ReactiveFormsModule,
  FormsModule,
  FontAwesomeModule,
];

// --- Components
import { StateTreeNodeComponent } from './components/state-tree-node/state-tree-node.component';

const components = [
  StateTreeNodeComponent,
];

// --- Pipes
import { ForOfPipe } from './pipes/for-of.pipe';

const pipes = [
  ForOfPipe,
];

@NgModule({
  declarations: [
    ...pipes,
    ...components,
  ],
  imports: [
    CommonModule,
    ...modules,
  ],
  exports: [
    ...modules,
    ...pipes,
    ...components,
  ],
})
export class SharedModule { }
