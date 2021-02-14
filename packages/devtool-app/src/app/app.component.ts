import { Component, OnInit } from '@angular/core';

import { Environment } from '../environments/environment';

// Services
import { EndpointConnector } from './core/data-flow';

@Component({
  selector: 'krix-devtool-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DevTool';

  constructor (
    private readonly endpointConnector: EndpointConnector,
  ) { }

  ngOnInit (): void {
    if (_.isNil(chrome) === true || _.isNil(chrome.devtools) === true) {
      // eslint-disable-next-line no-unused-expressions
      Environment.production === false && console.warn(`DevTool application wasn't started in the chrome environment`);
      return;
    }
    // eslint-disable-next-line no-unused-expressions
    Environment.production === false && console.log(chrome);
    // eslint-disable-next-line no-unused-expressions
    Environment.production === false && console.log(`DTA: Hello World!`);

    this.endpointConnector.connect();
  }
}
