import * as _ from 'lodash';

export namespace Pkg {
  export type Lodash = _.LoDashStatic;
}

export interface StateTreeNode {
  key: string;
  value: any;
  nodeIsOpen: boolean;
  nodeCanOpen: boolean;
}

