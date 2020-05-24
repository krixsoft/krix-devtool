
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
  export enum DevToolPlugin {
    InitPlugin = 'init-plugin',
    UpdateConnectionList = 'update-connection-list',
    HandleStoreCommand = 'handle-store-command',
  }
  export enum DevToolApp {
    InitDevTool = 'init-devtool-app',
  }
}

export type MsgCommands = MsgCommands.DevToolPlugin | MsgCommands.DevToolApp;
