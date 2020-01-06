import * as Core from '@krix-devtool/core';

console.log(`CS: Hello World!`);

const port = chrome.runtime.connect({
  name: Core.Constants.CSToBgSConnectionName,
});

port.onMessage.addListener((message, senderPort) => {
  console.log(`CS - onMessage:`, message, senderPort);
});

port.postMessage({
  payload: `Hi, I'm a content script!`,
});
