export interface StateChange {
  statePath: string;
  state: string[];
  oldValue: any;
  newValue: any;
  options?: {
    signal: boolean;
  };
}
