import * as Core from '@krix-devtool/core';

import { PackageStore } from '../package.store';
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
   * @param  {Core.Interfaces.EndpointMessage} message
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.EndpointMessage,
  ): void {
    switch (message.command) {
      case Core.Enums.MsgCommands.DevToolPlugin.ExecutePackageCommand:
        this.onExecutePackageCommand(message.payload);
        break;
      case Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList:
        this.onPackageUpdatePackageList(message.payload);
        break;
      default:
        console.error(`DTP * MessageHandler - onMessage: Catch unsupported command`);
        break;
    }

    console.log(`DTP * MessageHandler - onMessage:`, message);
  }

  /**
   * Handles `Update Package List` command. This logic finds all package ids by the package name and sends
   * these ids to the DTA.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.UpdatePackageListCommand} message
   * @return {void}
   */
  onPackageUpdatePackageList (
    message: Core.Interfaces.EndpointMessagePayload.UpdatePackageListCommand,
  ): void {
    const packageName = message?.packageName;

    if (packageName === null || packageName === undefined) {
      console.error(`DTP * MessageHandler - onPackageUpdatePackageList:`,
        `Package Name isn't defined`);
      return;
    }

    this.packageStore.sendUpdatePackageListCommand(packageName);
  }

  /**
   * Handles `Execute Package Command` command. This logic finds a package by the package name and package id
   * from the message. After that it executes a command from message and returns result to the DTA.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.ExecutePackageCommand} message
   * @return {void}
   */
  onExecutePackageCommand (
    message: Core.Interfaces.EndpointMessagePayload.ExecutePackageCommand,
  ): void {
    const packageName = message?.packageName;
    const packageId = message?.packageId;
    const packageInst: any = this.packageStore.getPackageInst(packageName, packageId);

    if (packageInst === null || packageInst === undefined) {
      console.error(`DTP * MessageHandler - onExecutePackageCommand:`,
        `Package (${packageName} - ${packageId}) doesn't exist`);
      return;
    }

    const packageInstFnName: string = message?.fnName;
    const packageInstFn: Function = packageInst[packageInstFnName];

    if (typeof packageInstFn !== 'function') {
      console.error(`DTP * MessageHandler - onExecutePackageCommand:`,
        `Package function (${packageInstFn}) doesn't exist in the package`);
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
