import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MessageHandler {
  private sjCommand: Subject<Core.Interfaces.EndpointMessage>;

  constructor () {
    this.sjCommand = new Subject();
  }

  /**
   * Creates an observable object which gets DTA commands.
   *
   * @return {Observable<Core.Interfaces.EndpointMessage>}
   */
  getCommandObserver (
  ): Observable<Core.Interfaces.EndpointMessage> {
    return this.sjCommand.asObservable();
  }

  /**
   * Handles a `Message` flow for a current connection.
   *
   * @param  {Core.Interfaces.EndpointMessage} message
   * @return {void}
   */
  onMessage (
    message: Core.Interfaces.EndpointMessage,
  ): void {
    this.sjCommand.next(message);
    switch (message.command) {
      case Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand:
        break;
      default:
        console.error(`DTA * MessageHandler - onMessage: Catch unsupported command`);
        break;
    }
  }
}
