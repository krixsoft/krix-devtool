import * as Enums from './enums';
import * as KrixStateStore from '@krix/state-store';

export type PackageCommands = Enums.StateStoreCommand;

export type MsgCommands = Enums.MsgCommands.DevToolPlugin
  | Enums.MsgCommands.DevToolApp
  | Enums.MsgCommands.BackgroundScript;

export interface OnInit {
  onInit(): void;
}

export interface InitDeps {
  initDeps(): void;
}

export interface EndpointMessage <PayloadType = any> {
  command: MsgCommands;
  target: Enums.AppEndpoint;
  source: Enums.AppEndpoint;
  payload?: PayloadType;
}

export interface ExtensionMessage <PayloadType = any> extends EndpointMessage<PayloadType> {
  tabId: number;
}

export type PackageType = KrixStateStore.StateStore;
export type PackageCommand = KrixStateStore.Interfaces.StoreCommand;

export interface PackageMessage  {
  packageName: Enums.PackageName;
  packageId: string;
  command: PackageCommand;
}

export namespace EndpointMessagePayload {

  export namespace Request {
    export interface ExecutePackageCommand {
      packageName: Enums.PackageName;
      packageId: string;
      packageCommand: PackageCommands;
      fnName: string;
      fnArgs: any[];
    }

    export interface UpdatePackageListCommand {
      packageName: Enums.PackageName;
    }
  }

  export namespace Response {
    export interface ExecutePackageCommand<TResult = any> {
      packageName: Enums.PackageName;
      packageId: string;
      packageCommand: PackageCommands;
      result: TResult;
    }

    export interface UpdatePackageListCommand {
      packageName: Enums.PackageName;
      packageIds: string[];
    }
  }

  export interface InitCSCommand {
    tabId: number;
  }
}

