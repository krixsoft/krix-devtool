import * as _ from 'lodash';
import * as Enums from './enums';

export namespace Pkg {
  export type Lodash = _.LoDashStatic;
}

export interface StateNode {
  key: string;
  value: any;
  valueType: Enums.ValueTypes;
  nodeIsOpened: boolean;
  nodeCanBeOpened: boolean;
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
