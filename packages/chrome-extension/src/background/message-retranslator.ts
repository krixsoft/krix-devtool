import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';
import * as Core from '@krix-devtool/core';

import { Interfaces, Enums } from '../shared';

export class MessageRetranslator extends Core.Singleton {
  private bridgeMetadataStore: Map<number, Interfaces.BridgeMetadata>;
  private sjBridgeMetadataNotif: Subject<Interfaces.BridgeNotification>;

  onInit (): void {
    this.bridgeMetadataStore = new Map();
    this.sjBridgeMetadataNotif = new Subject();
  }

  getObserver (): Observable<Interfaces.BridgeNotification> {
    return this.sjBridgeMetadataNotif
      .asObservable();
  }

  /**
   * Sets the CS port to the `Bridge Metadata` store by the specific tab identifier.
   * Emits `Bridge Metadata` notification.
   *
   * @param  {number} tabId
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  setCSPort (
    tabId: number,
    port: chrome.runtime.Port,
  ): void {
    // Get a bridge metadata by the tab id
    const bridgeMetadata = this.bridgeMetadataStore.get(tabId);

    // Update CS port in the bridge metadata
    const newBridgeMetadata: Interfaces.BridgeMetadata = _.assign({}, bridgeMetadata, {
      csPort: port,
    });

    // Save the new bridge metadata
    this.bridgeMetadataStore.set(tabId, newBridgeMetadata);

    // Emits `Bridge Metadata` notification
    this.sjBridgeMetadataNotif.next({
      tabId: tabId,
      type: Enums.BridgeNotificationType.ContentScript,
    });
  }

  /**
   * Sets the DTA port to the `Bridge Metadata` store by the specific tab identifier.
   * Emits `Bridge Metadata` notification.
   *
   * @param  {number} tabId
   * @param  {chrome.runtime.Port} port
   * @return {void}
   */
  setDTAPort (
    tabId: number,
    port: chrome.runtime.Port,
  ): void {
    // Get a bridge metadata by the tab id
    const bridgeMetadata = this.bridgeMetadataStore.get(tabId);

    // Update DTA port in the bridge metadata
    const newBridgeMetadata: Interfaces.BridgeMetadata = _.assign({}, bridgeMetadata, {
      dtaPort: port,
    });

    // Save the new bridge metadata
    this.bridgeMetadataStore.set(tabId, newBridgeMetadata);

    // Emits `Bridge Metadata` notification
    this.sjBridgeMetadataNotif.next({
      tabId: tabId,
      type: Enums.BridgeNotificationType.DevToolApp,
    });
  }

  /**
   * Sends message to the specific endpoint by the tab identifier and the endpoint type.
   *
   * @param  {Core.Interfaces.ExtensionMessage} message
   * @return {void}
   */
  sendMessage (
    message: Core.Interfaces.ExtensionMessage,
  ): void {
    // Get a bridge metadata by the tab id
    const bridgeMetadata = this.bridgeMetadataStore.get(message.tabId);

    switch (message.target) {
      // Send message to a DTA
      case Core.Enums.AppEndpoint.DevToolApp: {
        if (_.isNil(bridgeMetadata.dtaPort)) {
          console.warn(`BgS * MessageRetranslator - sendMessage:`,
            `BgS is trying to send messages to the unregistered DevTool Application (${message.tabId})`);
          return;
        }

        bridgeMetadata.dtaPort.postMessage(message);
        return;
      }
      // Send message to a CS or DTP
      case Core.Enums.AppEndpoint.ContentScript:
      case Core.Enums.AppEndpoint.DevToolPlugin: {
        if (_.isNil(bridgeMetadata.csPort)) {
          console.warn(`BgS * MessageRetranslator - sendMessage:`,
            `BgS is trying to send messages to the unregistered Content Script (${message.tabId})`);
          return;
        }

        bridgeMetadata.csPort.postMessage(message);
        return;
      }
      // Skip unsupported endpoints
      default:
        console.warn(`BgS * MessageRetranslator - sendMessage:`,
          `BgS is trying to send messages to the unsupported endpoint (${message.tabId}:${message.target})`);
    }
  }
}
