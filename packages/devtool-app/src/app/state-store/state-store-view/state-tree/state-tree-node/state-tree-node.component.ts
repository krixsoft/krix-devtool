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
  private stateWithOptions: StateTreeNode[] = [];

  @Input('state') set inState (value: any) {
    this.state = value;
    this.stateWithOptions = this.transform(this.state);
  }

  public faMinus = faMinus;
  public faPlus = faPlus;

  constructor () {}

  ngOnInit (): void {
  }

  onClickToggleShowUl (stateNode: StateTreeNode): void {
    stateNode.nodeIsOpened = !stateNode.nodeIsOpened;
  }

  checkNodeValueType (value: any): string {
    if (_.isArray(value)) { return ' [ ... ] '; }
    if (_.isObject(value)) { return ' { ... } '; }
  }

  getStateNodeValue (value: any): string {
    if (_.isObject(value)) { return null; }
    if (_.isString(value)) { return ` "${value}"`; }
    if (_.isNull(value)) { return 'null'; }
    if (_.isUndefined(value)) { return 'undefined'; }
    if (_.isNaN(value)) { return 'NaN'; }
    return value;
  }

  transform (store: any): any {
    if (!_.isObject(store)) { return; };

    const content: StateTreeNode[] = [];

    for (const key in store) {
      if (Object.prototype.hasOwnProperty.call(store, key) === false) {
        continue;
      }

      // Calculate `Node Can Be Opened` flag and copy state value
      let nodeCanBeOpened: boolean;
      let newValue: any;
      if (_.isObject(store[key]) || _.isArray(store[key])) {
        nodeCanBeOpened = true;
        newValue = _.clone(store[key]);
      } else {
        nodeCanBeOpened = false;
        newValue = store[key];
      }

      const nodeForState = _.find(this.stateWithOptions, [ 'key', key ]);
      // If node for state doesn't exist
      if (_.isNil(nodeForState) === true) {
        // Add new node
        const newNodeForState = {
          key: key,
          value: newValue,
          nodeCanBeOpened: nodeCanBeOpened,
          nodeIsOpened: false,
        };

        content.push(newNodeForState);
        continue;
      }

      // Otherwise recalculate `Node Is Opened` value
      const nodeIsOpened = nodeCanBeOpened === true
        ? nodeForState.nodeIsOpened : false;

      const updatedNodeForState = nodeForState.value === newValue
        // If value isn't updated - create copy of node
        ? _.clone(nodeForState)
        // Otherwise create new node with updated value and flags
        : _.assign({}, nodeForState, {
          value: newValue,
          nodeCanBeOpened: nodeCanBeOpened,
          nodeIsOpened: nodeIsOpened,
        });

      content.push(updatedNodeForState);
    }
    return content;
  }

  createCopyOfNodeValue (nodeValue: any): any {
    if (_.isObject(nodeValue) || _.isArray(nodeValue)) {
      return _.clone(nodeValue);
    }

    return nodeValue;
  }

  getColor (value: any): string {
    if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) {
      return '#ad7bad';
    }
    if (_.isNumber(value)) {
      return '#357bc3';
    }
    if (_.isString(value)) {
      return '#4da23e';
    }
    if (_.isBoolean(value)) {
      return '#d03131';
    }
  }

  trackByFn (index: number, item: any): string {
    return `${item.key}`;
  }
}
