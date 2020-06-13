import * as Core from '@krix-devtool/core';
import * as KrixStateStore from '@krix/state-store';

import { PackageStore } from './package.store';
import { MessageRetranslator } from './message-retranslator';

export class MessageHandler extends Core.Singleton {
  private messageRetranslator: MessageRetranslator;
  private packageStore: PackageStore;

  initDeps (
  ): void {
    this.messageRetranslator = MessageRetranslator.getInstance();
    this.packageStore = PackageStore.getInstance();
  }

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {MessageEvent} event
   * @return {void}
   */
  onMessage (
    event: MessageEvent,
  ): void {
    if (event.source !== window) {
      console.log(`MessageHandler - onMessage: Catch signal from unsupported provider`);
      return;
    }
    const message: Core.Interfaces.EndpointMessage = event.data;
    if (message.target !== Core.Enums.AppEndpoint.DevToolPlugin) {
      return;
    }

    switch (message.command) {
      case Core.Enums.MsgCommands.DevToolPlugin.ExecutePackageCommand:
        this.onExecutePackageCommand(message.payload);
        break;
      default:
        console.error(`MessageHandler - onMessage: Catch unsupported command`);
        break;
    }

    console.log(`MessageHandler - onMessage:`, event);
  }

  /**
   * Handles `Execute Package Command` command. This logic finds a package by the package name and package id
   * from the message. After that it executes a command from message and returns result to the DTA.
   * 
   * @param  {Core.Interfaces.EndpointMessage} message
   * @return {void}
   */
  onExecutePackageCommand (
    message: Core.Interfaces.EndpointMessagePayload.ExecutePackageCommand,
  ): void {
    const packageName = message?.packageName;
    const packageId = message?.packageId;
    const packageInst: any = this.packageStore.getPackageInst(packageName, packageId);

    if (packageInst === null || packageInst === undefined) {
      console.error(`MessageHandler - onMessage: Package (${packageName} - ${packageId}) doesn't exist`);
      return;
    }

    const packageInstFnName: string = message?.fnName;
    const packageInstFn: Function = packageInst[packageInstFnName];

    if (typeof packageInstFn !== 'function') {
      console.error(`MessageHandler - onMessage: Package function (${packageInstFn}) doesn't exist in the package`);
      return;
    }
  
    const packageInstFnArgs = message?.fnArgs ?? [];

    const result = packageInstFn.apply(packageInst, packageInstFnArgs);

    this.messageRetranslator.sendMessage(
      Core.Enums.MsgCommands.DevToolPlugin.ExecutePackageCommand,
      {
        packageName: packageName,
        packageId: packageId,
        packageCommand: message?.packageCommand,
        result: result,
      },
    );
  }
}
