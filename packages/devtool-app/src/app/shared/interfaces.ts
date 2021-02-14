import * as _ from 'lodash';

export namespace Pkg {
  export type Lodash = _.LoDashStatic;
}

/**
 * Object node is a key:pair value.
 */
export interface ObjectValueDescriptor {
  /**
   * The name of object node.
   */
  key: string;
  /**
   * A value which we get from an outer logic.
   */
  baseValue: any;
  /**
   * A cloned value of `baseValue` property. We clone the base value to avoid cases when
   * the value is changed by an outer logic, so our logic operate only "our" values.
   */
  value: any;
  valueIsOpened: boolean;
  valueCanBeOpened: boolean;
}

export interface ClickDelegateEvent {
  /**
   * data-id attribute
   */
  id: string;
  /**
   * data-type attribute
   */
  type: string;
  /**
   * CSS class.
   */
  tagSelector: string;
  /**
   * Native mouse event.
   */
  event: MouseEvent;
}

export interface ForOfPipeItem {
  key: string;
  value: any;
}
