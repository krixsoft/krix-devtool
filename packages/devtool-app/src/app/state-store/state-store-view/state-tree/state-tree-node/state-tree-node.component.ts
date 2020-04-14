import { Component, OnInit, Input } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import * as _ from 'lodash';
import { StateTreeNode } from '../../../../shared/interfaces';

@Component({
  selector: 'krix-state-tree-node',
  templateUrl: './state-tree-node.component.html',
})
export class StateTreeNodeComponent implements OnInit {
  private state: any = {};
  private stateWithOptions: any = {};

  @Input('state') set inState (value: any) {
    this.state = value;
    this.stateWithOptions = this.transform(this.state);
  }

  public faMinus = faMinus;
  public faPlus = faPlus;

  constructor () { }

  ngOnInit (): void {

  }

  onClickToggleShowUl (stateNode: StateTreeNode): void {
    stateNode.nodeIsOpen = !stateNode.nodeIsOpen;
  }

  getStateNodeValue (value: any): string {
    if (_.isObject(value)) { return null; }
    if (_.isString(value)) { return ` "${value}"`; }
    if (_.isNull(value)) { return 'null'; }
    if (_.isUndefined(value)) { return 'undefined'; }
    if (_.isNaN(value)) { return 'NaN'; }
    return value;
  }

  transform (value: any): any {
    if (!_.isObject(value)) { return; };
    const content: { key: string; value: any; isOpen?: boolean; canOpen?: boolean }[] = [];
    for (const key in value) {
      if (!key) {
        continue;
      }
      let newObject = { key: key, value: value[key], canOpen: false };
      if (_.isObject(newObject.value)) {
        newObject = _.assign({}, newObject, { nodeCanOpen: true, nodeIsOpen: false });
      }
      content.push(newObject);
    }
    return content;
  }

  getColor (value: any): string {
    if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) { return '#ad7bad'; }
    if (_.isNumber(value)) { return '#4f80b3'; }
    if (_.isString(value)) { return '#76bb6a'; }
    if (_.isBoolean(value)) { return '#d64848'; }
  }
}
