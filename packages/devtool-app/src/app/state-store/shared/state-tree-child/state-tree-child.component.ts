import { Component, OnInit, Input } from '@angular/core';
import { StateChange } from '../interfaces';

@Component({
  selector: 'krix-state-tree-child',
  templateUrl: './state-tree-child.component.html',
})
export class StateTreeChildComponent implements OnInit {
  @Input() state: any = {};

  constructor() {}

  ngOnInit() {}
}
