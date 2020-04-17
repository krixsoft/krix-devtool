import { Component, OnInit, Input } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import * as _ from 'lodash';
import * as Interfaces from '../../../../shared/interfaces';

@Component({
  selector: 'krix-state-tree-node',
  templateUrl: './state-tree-node.component.html',
})
export class StateTreeNodeComponent implements OnInit {
  private state: any = {};
  private childrenStateNodes: Interfaces.StateNode[] = [];

  @Input('store')
  set inStore (value: any) {
    this.state = value;
    this.childrenStateNodes = this.createStateNodesFromStore(this.state);
  }

  /**
   * ICONs
   */
  public faMinus = faMinus;
  public faPlus = faPlus;

  constructor () { ; }

  ngOnInit (): void { ; }

  /**
   * Handles `Click` events for the `UL` tag. Switchs a `Node Is Opened` flag to the
   * opposite value.
   *
   * @param stateNode
   */
  onClickToggleShowUl (
    stateNode: Interfaces.StateNode,
  ): void {
    stateNode.nodeIsOpened = !stateNode.nodeIsOpened;
  }

  /**
   * Returns a string representation of value.
   *
   * @param  {any} value
   * @return {string}
   */
  getStringRepresentationOfValue (
    value: any,
  ): string {
    if (_.isArray(value)) {
      return ' [ ... ] ';
    }

    if (_.isObject(value)) {
      return ' { ... } ';
    }

    if (_.isString(value)) {
      return ` "${value}"`;
    }

    if (_.isNull(value)) {
      return 'null';
    }

    if (_.isUndefined(value)) {
      return 'undefined';
    }

    if (_.isNaN(value)) {
      return 'NaN';
    }
    return value;
  }

  /**
   * Iterates the component store and creates from it `State Node` entities.
   *
   * @param  {any} store
   * @return {Interfaces.StateNode[]}
   */
  createStateNodesFromStore (
    store: any,
  ): Interfaces.StateNode[] {
    if (!_.isObject(store)) { return; };

    const stateNodes: Interfaces.StateNode[] = [];

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

      const nodeForState = _.find(this.childrenStateNodes, ['key', key]);
      // If node for state doesn't exist
      if (_.isNil(nodeForState) === true) {
        // Add new node
        const newNodeForState = {
          key: key,
          value: newValue,
          nodeCanBeOpened: nodeCanBeOpened,
          nodeIsOpened: false,
        };

        stateNodes.push(newNodeForState);
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

      stateNodes.push(updatedNodeForState);
    }

    return stateNodes;
  }

  /**
   * Defines the type of a state and returns corresponding color.
   *
   * @param  {any} value
   * @return {string} - hex code of color
   */
  getColor (
    value: any,
  ): string {
    if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) {
      return '#ad7bad';
    }

    if (_.isArray(value) || _.isObject(value)) {
      return '#f4a460';
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

  /**
   * Returns an uniq key for item from args.
   *
   * @param  {number} index
   * @param  {any} item
   * @return {string}
   */
  trackByFn (
    index: number,
    item: any,
  ): string {
    return `${item.key}`;
  }
}
