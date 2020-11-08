import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';

// Services
import { MessageRetranslator } from './data-flow/message-retranslator';

@Injectable()
export class MessageService {

  constructor (
    private messageRetranslator: MessageRetranslator,
  ) {
  }

  /**
   * Sends the request to get the list of packages by the package name.
   *
   * @param  {Core.Enums.PackageName} packageName
   * @return {void}
   */
  updatePackageList (
    packageName: Core.Enums.PackageName,
  ): void {
    this.messageRetranslator.sendMessage<Core.Interfaces.EndpointMessagePayload.Request.UpdatePackageListCommand>(
      Core.Enums.AppEndpoint.DevToolPlugin,
      Core.Enums.MsgCommands.DevToolPlugin.UpdatePackageList,
      {
        packageName: packageName,
      },
    );
  }
}
