import * as _ from 'lodash';

export namespace Pkg {
  export type Lodash = _.LoDashStatic;
}

export interface StateNode {
  key: string;
  value: any;
  nodeIsOpened: boolean;
  nodeCanBeOpened: boolean;
}

