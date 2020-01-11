import { Inject, Component, OnInit } from '@angular/core';

import * as Core from '@krix-devtool/core';

import * as Shared from './shared';

// Services
import {
  MessageRetranslatorService,
} from './core/services';

@Component({
  selector: 'krix-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  title = 'DevTool';

  constructor (
    private readonly messageRetranslator: MessageRetranslatorService,
    @Inject(Shared.Constants.DI.Lodash)
    private readonly lodash: Shared.Interfaces.Pkg.Lodash,
  ) {
  }

  ngOnInit (): void {
    if (this.lodash.isNil(chrome)) {
      return;
    }
    console.log(chrome);

    console.log(`DTA: Hello World!`);

    // TODO: Move to BridgeConnectorService
    const port = chrome.runtime.connect({
      name: Core.Constants.DTAToBgSConnectionName,
    });
    this.messageRetranslator.setBgSPort(port);

    const tabId = this.lodash.get(chrome, `devtools.inspectedWindow.tabId`);
    this.messageRetranslator.setIdentifier(tabId);

    // TODO: Move to BridgeConnectorService
    port.onMessage.addListener((message, senderPort) => {
      console.log(`DTA - onMessage:`, message, senderPort);
    });

    this.messageRetranslator.sendMessage(
      Core.Enums.AppEndpoint.BackgroundScript,
      Core.Enums.MsgCommands.DevToolApp.InitDevTool,
    );
  }
}
