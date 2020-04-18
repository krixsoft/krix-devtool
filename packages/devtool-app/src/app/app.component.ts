import { Inject, Component, OnInit } from '@angular/core';

import * as Core from '@krix-devtool/core';
import * as Krix from '@krix/state-store';
import * as Shared from './shared';

// Services
import { MessageRetranslatorService } from './core/services';
import { HistoryService } from './state-store/core/history.service';

import { stateChanges } from './state-store/example';

@Component({
  selector: 'krix-devtool-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DevTool';

  constructor (
    private readonly messageRetranslator: MessageRetranslatorService,
    @Inject(Shared.Constants.DI.Lodash)
    private readonly lodash: Shared.Interfaces.Pkg.Lodash,
    private historyService: HistoryService,
  ) { }

  ngOnInit (): void {
    if (this.lodash.isNil(chrome)) {
      return;
    }
    console.log(chrome);

    console.log(`DTA: Hello World!`);

    stateChanges.map((stateChange: Krix.Interfaces.StoreChange) => {
      this.historyService.addStateChange(stateChange);
    });

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
