import * as Core from '@krix-devtool/core';

export class MessageRetranslator extends Core.Singleton {

  /**
   * Sends a package message to the CS. The package message consists of:
   * - a package name;
   * - a package identifier;
   * - a package command.
   *
   * @param  {Core.Enums.PackageName} packageName
   * @param  {string} packageId
   * @param  {Core.Interfaces.PackageCommand} command
   * @return {void}
   */
  sendPackageMessage (
    packageName: Core.Enums.PackageName,
    packageId: string,
    command: Core.Interfaces.PackageCommand,
  ): void {
    const messsag: Core.Interfaces.PackageMessage = {
      packageName: packageName,
      packageId: packageId,
      command: command,
    };

    this.sendMessage(
      Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand,
      messsag,
    );
  }

  /**
   * Sends a bridge message to the CS.
   *
   * @param  {Core.Enums.MsgCommands} message
   * @param  {MessagePayloadType} msgData
   * @return {void}
   */
  sendMessage <MessagePayloadType = any> (
    msgCommand: Core.Enums.MsgCommands,
    msgPayload?: MessagePayloadType,
  ): void {
    const messsag: Core.Interfaces.EndpointMessage<MessagePayloadType> = {
      command: msgCommand,
      target: Core.Enums.AppEndpoint.DevToolApp,
      source: Core.Enums.AppEndpoint.DevToolPlugin,
      payload: msgPayload,
    };

    window.postMessage(messsag, '*');
  }
}
