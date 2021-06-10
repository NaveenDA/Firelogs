


let tabContext = null;
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// chrome.scripting.executeScript

// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null, {file: "bundle.js"});
// });
let tabExt = null;
let port = null;
chrome.browserAction.onClicked.addListener(async function () {

  chrome.tabs.executeScript(null, {
		file: "/dist/bundle.js"
	}); 

// console.log(await getCurrentTab())
//   chrome.tabs.executeScript(
//     null,
//     { code: "var x = 10; x" },
//     function (results) {
//       console.log(results);
//     }
//   );

//   chrome.tabs.executeScript({
//     file: "dist/bundle.js"
//   });

  // chrome.tabs.create({url:chrome.extension.getURL("dummy.html")}, function(tab) {

  // 	tabExt = tab;

  // 	var onBeforeRequest_callback = function(details) {

  // 			if (details.tabId > 0) {

  // 				chrome.tabs.get(details.tabId, function (tab) {
  // 					port.postMessage({Type: 'Request', Details: details, TabInfo: tab});
  // 				});

  // 			} else {
  // 				port.postMessage({Type: 'Request', Details: details});
  // 			}

  // 			console.log(details);
  //       return {};
  // 		},
  // 		onBeforeSendHeaders_callback = function(details) {
  // 			port.postMessage({Type: 'SendHeaders', Details: details});
  // 			console.log(details);
  //       return {};
  // 		},
  // 		onHeadersReceived_callback = function(details) {
  // 			port.postMessage({Type: 'Received', Details: details});
  // 			console.log(details);
  //       return {};
  // 		},
  // 		onCompleted_callback = async function(details) {

  //       chrome.tabs.executeScript( null, {code:"var x = 10; x"},
  //  function(results){ console.log(results); } );
  //       // if(details.initiator === "https://help.servicedeskplus.com"){
  //       //   chrome.tabs.executeScript()
  //       //   // var count = await FIRELOGS_INTERNAL.Storage.get("count");
  //       //   // console.log(count);
  //       //   // await FIRELOGS_INTERNAL.Storage.set("count", count++);
  //       //   // jQuery("#__firelog").trigger("updateCount");
  //       // }
  //       details.fuc = "loo";
  // 			port.postMessage({Type: 'Completed', Details: details});
  // 			console.log(details);
  //       return {};
  // 		},
  // 		onErrorOccurred_callback = function(details) {
  // 			port.postMessage({Type: 'ErrorOccurred', Details: details});
  // 			console.log(details);
  //       return {};
  // 		},
  // 		onUpdated_callback = function(tabId, changeInfo, tab) {

  // 			if (changeInfo.status == "complete" && tab.id == tabExt.id) {
  // 				port = chrome.tabs.connect(tab.id);
  // 			}
  // 		},
  // 		onRemoved_callback = function(tabId) {

  // 			if (tabId == tabExt.id) {

  // 				tabExt = null;

  // 				//chrome.tabs.remove(tabId);

  // 				chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest_callback);
  // 				chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders_callback);
  // 				chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived_callback);
  // 				chrome.webRequest.onCompleted.removeListener(onCompleted_callback);
  // 				chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurred_callback);
  // 				chrome.tabs.onUpdated.removeListener(onUpdated_callback);
  // 				chrome.tabs.onRemoved.removeListener(onRemoved_callback);

  // 				chrome.browserAction.setBadgeText({text: ""});
  // 				chrome.browserAction.setTitle({title: "Start Web Sniffer"});
  // 			}
  // 		};

  // 	chrome.tabs.onUpdated.addListener(onUpdated_callback);
  // 	chrome.tabs.onRemoved.addListener(onRemoved_callback);

  // 	chrome.webRequest.onBeforeRequest.addListener(
  // 		onBeforeRequest_callback,
  // 		{urls: ["<all_urls>"]},
  // 		["blocking", "requestBody"]
  // 	);

  // 	chrome.webRequest.onBeforeSendHeaders.addListener(
  // 		onBeforeSendHeaders_callback,
  // 		{urls: ["<all_urls>"]},
  // 		["blocking", "requestHeaders"]
  // 	);

  // 	chrome.webRequest.onHeadersReceived.addListener(
  // 		onHeadersReceived_callback,
  // 		{urls: ["<all_urls>"]},
  // 		["blocking", "responseHeaders"]
  // 	);

  // 	chrome.webRequest.onCompleted.addListener(
  // 		onCompleted_callback,
  // 		{urls: ["<all_urls>"]},
  // 		["responseHeaders"]
  // 	);

  // 	chrome.webRequest.onErrorOccurred.addListener(
  // 		onErrorOccurred_callback,
  // 		{urls: ["<all_urls>"]}
  // 	);

  // });

  // chrome.webRequest.onBeforeRequest.addListener(function(details){
  //   console.log(details);
  // })
  // var onBeforeRequest_callback = function(details) {
  //   console.log(details);
  // }

  // chrome.webRequest.onBeforeRequest.addListener(
  //   function(details) {
  //     console.log({details});
  //     return {cancel: details.url.indexOf("://www.evil.com/") != -1};
  //   },
  //   {urls: ["<all_urls>"]},
  //   ["blocking"]
  // );
});

// document.addEventListener("DOMContentLoaded", function() {

// });
