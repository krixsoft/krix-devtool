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
   * Handles a `Endpoint` message.
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
        this.onUpdatePackageList(message.payload);
        break;
      default:
        console.error(`DTP.MessageHandler.onMessage: Catch unsupported command`);
        break;
    }

    console.log(`DTP.MessageHandler.onMessage:`, message);
  }

  /**
   * Handles `Update Package List` command.
   * - gets the list of all package ids by the package name from the `Package` store.
   * - sends the list of all package ids to the DTA.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.Request.UpdatePackageListCommand} message
   * @return {void}
   */
  onUpdatePackageList (
    message: Core.Interfaces.EndpointMessagePayload.Request.UpdatePackageListCommand,
  ): void {
    const packageName = message?.packageName;

    if (packageName === null || packageName === undefined) {
      console.error(`DTP.MessageHandler.onPackageUpdatePackageList:`,
        `Package Name isn't defined`);
      return;
    }

    // Get the list of all package ids by the package name from the `Package` store
    const packageIds = this.packageStore.getAllPackageIds(packageName);

    // Send the list of all package ids to the DTA
    this.messageRetranslator.sendMessage<Core.Interfaces.EndpointMessagePayload.Response.UpdatePackageListCommand>(
      Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList,
      {
        packageName: packageName,
        packageIds: packageIds,
      },
    );
  }

  /**
   * Handles `Execute Package Command` command.
   * - gets a package by the package name and package id.
   * - executes a command from message.
   *   - extracts and checks the package instance function.
   *   - extracts the package instance function arguments.
   * - returns a result to the DTA.
   *
   * @param  {Core.Interfaces.EndpointMessagePayload.Request.ExecutePackageCommand} message
   * @return {void}
   */
  onExecutePackageCommand (
    message: Core.Interfaces.EndpointMessagePayload.Request.ExecutePackageCommand,
  ): void {
    const packageName = message?.packageName;
    const packageId = message?.packageId;
    // Get a package by the package name and package id
    const packageInst: any = this.packageStore.getPackageInst(packageName, packageId);

    if (packageInst === null || packageInst === undefined) {
      console.error(`DTP.MessageHandler.onExecutePackageCommand:`,
        `Package (${packageName} - ${packageId}) doesn't exist`);
      return;
    }

    // Extract and check the package instance function
    const packageInstFnName: string = message?.fnName;
    const packageInstFn: Function = packageInst[packageInstFnName];

    if (typeof packageInstFn !== 'function') {
      console.error(`DTP.MessageHandler.onExecutePackageCommand:`,
        `Package function (${packageInstFn}) doesn't exist in the package`);
      return;
    }

    // Extract the package instance function arguments
    const packageInstFnArgs = message?.fnArgs ?? [];

    // Execute a command from message
    const result = packageInstFn.apply(packageInst, packageInstFnArgs);

    // Return a result to the DTA
    this.messageRetranslator.sendMessage<Core.Interfaces.EndpointMessagePayload.Response.ExecutePackageCommand>(
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
