import { Injectable } from '@angular/core';
import * as Core from '@krix-devtool/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MessageHandler {
  private sjPackageCommand: Subject<Core.Interfaces.PackageMessage>;

  constructor () {
    this.sjPackageCommand = new Subject();
  }

  getPackageCommandObserver (
  ): Observable<Core.Interfaces.PackageMessage> {
    return this.sjPackageCommand.asObservable();
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
    switch (message.command) {
      case Core.Enums.MsgCommands.DevToolApp.HandlePackageCommand:
        this.sjPackageCommand.next(message.payload);
        break;
      default:
        console.error(`DTA * MessageHandler - onMessage: Catch unsupported command`);
        break;
    }
  }
}
