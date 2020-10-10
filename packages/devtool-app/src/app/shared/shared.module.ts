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

// --- Direvtives
import { ClickDelegateDirective } from './directives/click-delegate.directive';
import { ScrollBottomStickDirective } from './directives/scroll-bottom-stick.directive';

const directives = [
  ClickDelegateDirective,
  ScrollBottomStickDirective,
];

// --- Pipes
import { ForOfPipe } from './pipes/for-of.pipe';

const pipes = [
  ForOfPipe,
];

@NgModule({
  declarations: [
    ...pipes,
    ...directives,
    ...components,
  ],
  imports: [
    CommonModule,
    ...modules,
  ],
  exports: [
    ...modules,
    ...pipes,
    ...directives,
    ...components,
  ],
})
export class SharedModule { }
