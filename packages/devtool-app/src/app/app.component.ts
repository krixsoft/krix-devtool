import { Component, OnInit } from '@angular/core';

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
      console.warn(`DevTool application wasn't started in the chrome environment`);
      return;
    }
    console.log(chrome);
    console.log(`DTA: Hello World!`);

    this.endpointConnector.connect();
  }
}
