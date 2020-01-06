import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import * as Core from '@krix-devtool/core';

import { Interfaces, Enums } from '../shared';

export class MessageRetranslator extends Core.Singleton {
  private store: Map<number, Interfaces.BridgeMetadata>;
  private sjNotification: Subject<Interfaces.BridgeNotification>;

  onInit (): void {
    this.store = new Map();
    this.sjNotification = new Subject();
  }

  getObserver (): Observable<Interfaces.BridgeNotification> {
    return this.sjNotification
      .asObservable();
  }

  setCSPort (id: number, port: chrome.runtime.Port): void {
    const bridgeMetadata = this.store.get(id);
    const newBridgeMetadata: Interfaces.BridgeMetadata = _.assign({}, bridgeMetadata, {
      csPort: port,
    });

    this.store.set(id, newBridgeMetadata);
    this.sjNotification.next({
      id: id,
      type: Enums.BridgeNotificationType.ContentScript,
    });
  }

  setDTAPort (id: number, port: chrome.runtime.Port): void {
    const bridgeMetadata = this.store.get(id);
    const newBridgeMetadata: Interfaces.BridgeMetadata = _.assign({}, bridgeMetadata, {
      dtaPort: port,
    });

    this.store.set(id, newBridgeMetadata);
    this.sjNotification.next({
      id: id,
      type: Enums.BridgeNotificationType.DevToolApp,
    });
  }

  sendMessage (message: Core.Interfaces.BaseMessage): void {
    const bridgeMetadata = this.store.get(message.id);

    switch (message.ept) {
      case Core.Enums.AppEndpoint.DevToolApp: {
        if (_.isNil(bridgeMetadata.dtaPort)) {
          console.warn(`MessageRetranslator - sendMessage:`,
            `BgS is trying to send messages to the unregistered DevTool Application (${message.id})`);
          return;
        }

        bridgeMetadata.dtaPort.postMessage(message);
        return;
      }
      case Core.Enums.AppEndpoint.ContentScript:
      case Core.Enums.AppEndpoint.DevToolPlugin: {
        if (_.isNil(bridgeMetadata.csPort)) {
          console.warn(`MessageRetranslator - sendMessage:`,
            `BgS is trying to send messages to the unregistered Content Script (${message.id})`);
          return;
        }

        bridgeMetadata.csPort.postMessage(message);
        return;
      }
      default:
        console.warn(`MessageRetranslator - sendMessage:`,
          `BgS is trying to send messages to the unsupported endpoint (${message.id}:${message.ept})`);
    }
  }
}
