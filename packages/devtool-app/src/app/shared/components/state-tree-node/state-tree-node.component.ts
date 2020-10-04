import { ValueTypes } from './../../enums';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

import * as _ from 'lodash';
import * as Interfaces from '../../interfaces';

@Component({
  selector: 'krix-state-tree-node',
  templateUrl: './state-tree-node.component.html',
})
export class StateTreeNodeComponent implements OnInit {
  private state: any = {};
  public childrenStateNodes: Interfaces.StateNode[] = [];
  public objectPreview: string = '';

  @Input('store')
  set inStore (value: unknown) {
    this.state = value;
    this.childrenStateNodes = this.createStateNodesFromStore(this.state);
    this.changeDetection.detectChanges();
  }

  /**
   * ICONs
   */
  public faMinus = faMinus;
  public faPlus = faPlus;

  constructor (
    private sanitizer: DomSanitizer,
    private changeDetection: ChangeDetectorRef,
  ) {
    this.changeDetection.detach();
  }

  ngOnInit (): void { }

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
    this.changeDetection.detectChanges();
  }

  /**
   * Returns a string representation of value.
   *
   * @param  {any} value
   * @return {string}
   */
  getStringRepresentationOfValue (
    value: unknown,
  ): string {
    if (_.isArray(value)) {
      return '[ ... ]';
    }

    if (_.isObject(value)) {
      return '{ ... }';
    }

    if (_.isString(value)) {
      return `"${value}"`;
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

    return `${value}`;
  }

  /**
   * Iterates the component store and creates from it `State Node` entities.
   *
   * @param  {any} store
   * @return {Interfaces.StateNode[]}
   */
  createStateNodesFromStore (
    store: unknown,
  ): Interfaces.StateNode[] {
    if (!_.isObject(store)) {
      return;
    }

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

      const stateValueType = this.getValueType(newValue);

      const nodeForState = _.find(this.childrenStateNodes, ['key', key]);
      // If node for state doesn't exist
      if (_.isNil(nodeForState) === true) {
        // Add new node
        const newNodeForState: Interfaces.StateNode = {
          key: key,
          value: newValue,
          valueType: stateValueType,
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
          valueType: stateValueType,
        });

      stateNodes.push(updatedNodeForState);
    }

    return stateNodes;
  }

  /**
   * Returns the color class corresponding to the type.
   *
   * @param  {string} type
   * @return {string} - class with color
   */
  getColorClassName (
    type: ValueTypes,
  ): string {
    switch (type) {
      case ValueTypes.Null: case ValueTypes.NaN: case ValueTypes.Undefined: return 'null-or-undefined';
      case ValueTypes.Number: return 'number';
      case ValueTypes.Array: case ValueTypes.Object: return 'object';
      case ValueTypes.String: return 'string';
      case ValueTypes.Boolean: return 'boolean';
    }
  }

  /**
   * Returns a string representation of value type.
   *
   * @param  {any} value
   * @return {ValueTypes}
   */
  getValueType (
    value: unknown,
  ): ValueTypes {
    if (_.isNull(value)) {
      return ValueTypes.Null;
    }
    if (_.isUndefined(value)) {
      return ValueTypes.Undefined;
    }
    if (_.isNaN(value)) {
      return ValueTypes.NaN;
    }

    if (_.isArray(value)) {
      return ValueTypes.Array;
    }

    if (_.isObject(value)) {
      return ValueTypes.Object;
    }

    if (_.isNumber(value)) {
      return ValueTypes.Number;
    }

    if (_.isString(value)) {
      return ValueTypes.String;
    }

    if (_.isBoolean(value)) {
      return ValueTypes.Boolean;
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
    item: Interfaces.StateNode,
  ): string {
    return `${item.key}`;
  }

  /**
   *
   * @param  {any} object
   * @returns string
   */
  showObjectPreview (
    object: unknown,
  ): any {
    if (_.isObject(object) === false) { return object; }

    const objectPreviewFields: string[] = [];

    for (const key in object as any) {
      if (Object.prototype.hasOwnProperty.call(object, key) === false) {
        continue;
      }

      const value = _.isString(object[key]) ? `"${object[key]}"` : object[key];
      const valueType = this.getValueType(value);
      const colorClassName = this.getColorClassName(valueType);

      const htmlTemplate = `<span class="${colorClassName}"> ${value} </span>`;

      let valueString: string;

      if (_.isArray(value)) {
        valueString = ` ${key}: <span class="object">[ ... ]</span>`;
      } else if (_.isObject(value)) {
        valueString = ` ${key}: <span class="object">{ ... }</span>`;
      } else {
        valueString = ` ${key}: ${htmlTemplate}`;
      }

      objectPreviewFields.push(valueString);
    }

    const previewString = objectPreviewFields.join(',');

    const leftBracket = _.isArray(object) ? '[' : '{';
    const rightBracket = _.isArray(object) ? ']' : '}';

    const previewStringWithBrackets = `<span class="object">${leftBracket}</span> ${previewString}`
      + ` <span class="object">${rightBracket}</span>`;

    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(previewStringWithBrackets);
    return sanitizedHtml;
  }
}
