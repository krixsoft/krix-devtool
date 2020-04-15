import * as _ from 'lodash';

export namespace Pkg {
  export type Lodash = _.LoDashStatic;
}

export interface StateTreeNode {
  key: string;
  value: any;
  nodeIsOpened: boolean;
  nodeCanBeOpened: boolean;
}

