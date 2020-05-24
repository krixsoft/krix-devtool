import * as Enums from './enums';

export interface Resource <ResourceValueType = any> {
  name: Enums.ResourceName;
  value: ResourceValueType;
}

export interface GlobalStore {
  userCounter: number;
  userId: string;
}
