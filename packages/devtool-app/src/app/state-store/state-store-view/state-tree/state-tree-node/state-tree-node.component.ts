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

    const content: { key: string; value: any; nodeIsOpen?: boolean; nodeCanOpen?: boolean }[] = [];

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key) === false) {
        continue;
      }

      const previousState = _.find(this.stateWithOptions, ['key', key]);

      if (_.isNil(previousState) === false) {
        const newState = _.assign({}, previousState, { value: value[key] });
        content.push(newState);
        continue;
      }

      if (_.isObject(value[key])) {
        content.push({ key: key, value: value[key], nodeCanOpen: true, nodeIsOpen: false });
        continue;
      }

      content.push({ key: key, value: value[key], nodeCanOpen: false, nodeIsOpen: false });
    }
    return content;
  }

  getColor (value: any): string {
    if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) { return '#ad7bad'; }
    if (_.isNumber(value)) { return '#357bc3'; }
    if (_.isString(value)) { return '#4da23e'; }
    if (_.isBoolean(value)) { return '#d03131'; }
  }
}
