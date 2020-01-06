console.log(`BgS: Hello World!`);

chrome.runtime.onConnect.addListener((port) => {
  console.log(`BgS - onConnect:`, port);

  port.onMessage.addListener((message, senderPort) => {
    console.log(`BgS - onMessage:`, message, senderPort);
    port.postMessage({ payload: `Hello!` });
  });
});
