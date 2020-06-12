import * as Enums from './enums';
import * as KrixStateStore from '@krix/state-store';

export interface OnInit {
  onInit(): void;
}

export interface InitDeps {
  initDeps(): void;
}

export interface ExtensionMessage <PayloadType = any> extends EndpointMessage<PayloadType> {
  tabId: number;
}

export interface EndpointMessage <PayloadType = any> {
  command: Enums.MsgCommands;
  target: Enums.AppEndpoint;
  source: Enums.AppEndpoint;
  payload?: PayloadType;
}

export type PackageType = KrixStateStore.StateStore;
export type PackageCommand = KrixStateStore.Interfaces.StoreCommand;

export interface PackageMessage  {
  packageName: Enums.PackageName;
  packageId: string;
  command: PackageCommand;
}
