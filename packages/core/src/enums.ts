
export enum AppEndpoint {
  DevToolPlugin = 'dev-tool-plugin',
  ContentScript = 'content-script',
  BackgroundScript = 'background-script',
  DevToolApp = 'dev-tool-app',
}

export namespace MsgCommands {
  export enum DevToolApp {
    InitDevTool = 'init-dev-tool',
  }
}

export type MsgCommands = MsgCommands.DevToolApp;
