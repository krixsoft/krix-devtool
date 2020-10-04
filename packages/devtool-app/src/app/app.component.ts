import { Inject, Component, OnInit } from '@angular/core';

import * as Shared from './shared';

// Services
import { EndpointConnector } from './core/data-flow';

@Component({
  selector: 'krix-devtool-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DevTool';

  constructor (
    @Inject(Shared.Constants.DI.Lodash)
    private readonly lodash: Shared.Interfaces.Pkg.Lodash,
    private readonly endpointConnector: EndpointConnector,
  ) { }

  ngOnInit (): void {
    if (this.lodash.isNil(chrome) === true || this.lodash.isNil(chrome.devtools) === true) {
      console.warn(`DevTool application wasn't started in the chrome environment`);
      return;
    }
    console.log(chrome);
    console.log(`DTA: Hello World!`);

    this.endpointConnector.connect();
  }
}
