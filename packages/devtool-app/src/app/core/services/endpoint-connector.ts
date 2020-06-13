import { Injectable, Inject } from '@angular/core';
import * as Core from '@krix-devtool/core';

import * as Shared from '../../shared';

import { MessageRetranslator } from './message-retranslator';

@Injectable()
export class EndpointConnector {
  constructor (
    @Inject(Shared.Constants.DI.Lodash)
    private readonly lodash: Shared.Interfaces.Pkg.Lodash,
    private messageRetranslator: MessageRetranslator,
  ) {
  }

  /**
   * Creates connection to the BgS.
   *
   * @return {void}
   */
  public connect (
  ): void {
    const port = chrome.runtime.connect({
      name: Core.Constants.DTAToBgSConnectionName,
    });
    this.messageRetranslator.setBgSPort(port);

    // Get tab identifier where user opened dev-tool
    const tabId = this.lodash.get(chrome, `devtools.inspectedWindow.tabId`);
    this.messageRetranslator.setTabId(tabId);

    console.log(`EndpointConnector - connect:`, `Tab Id: ${tabId}, Port:`, port);

    // Add `Message` watcher to port
    port.onMessage.addListener((message, senderPort) => {
      this.onMessage(message, senderPort);
    });

    // Send `Init Dev-Tool` command
    this.messageRetranslator.sendMessage(
      Core.Enums.AppEndpoint.BackgroundScript,
      Core.Enums.MsgCommands.BackgroundScript.InitDTA,
    );
  }

  private onMessage (
    message: Core.Interfaces.ExtensionMessage,
    port: chrome.runtime.Port,
  ): void {
    console.log(`EndpointConnector - onMessage:`, message, port);
  }
}
