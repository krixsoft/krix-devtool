
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
  export enum DevToolApp {
    InitDevTool = 'init-dev-tool',
  }
}

export type MsgCommands = MsgCommands.DevToolApp;
