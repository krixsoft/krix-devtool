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

