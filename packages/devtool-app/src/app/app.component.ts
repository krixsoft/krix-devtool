import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as Core from '@krix-devtool/core';

@Component({
  selector: 'krix-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  title = 'DevTool';

  ngOnInit (): void {
    if (_.isNil(chrome)) {
      return;
    }

    console.log(`DTA: Hello World!`);

    const port = chrome.runtime.connect({
      name: Core.Constants.DTAToBgSConnectionName,
    });

    port.onMessage.addListener((message, senderPort) => {
      console.log(`DTA - onMessage:`, message, senderPort);
    });

    port.postMessage({
      payload: `Hi, I'm a DevTool Application!`,
    });
  }
}