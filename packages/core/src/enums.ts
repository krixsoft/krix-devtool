
export enum PackageName {
  StateStore = 'state-store',
  DataStore = 'data-store',
}

export enum AppEndpoint {
  DevToolPlugin = 'devtool-plugin',
  ContentScript = 'content-script',
  BackgroundScript = 'background-script',
  DevToolApp = 'devtool-app',
}

export namespace MsgCommands {
  export enum BackgroundScript {
    InitCS = 'InitCS',
    InitDTA = 'InitDTA',
  }
  export enum DevToolPlugin {
    UpdatePackageList = 'UpdatePackageList',
    ExecutePackageCommand = 'ExecutePackageCommand',
  }
  export enum DevToolApp {
    HandlePackageCommand = 'HandlePackageCommand',
  }
}

export enum StateStoreCommand {
  GetStore = 'GetStore',
}

export type PackageCommands = StateStoreCommand;

export type MsgCommands = MsgCommands.DevToolPlugin | MsgCommands.DevToolApp | MsgCommands.BackgroundScript;
