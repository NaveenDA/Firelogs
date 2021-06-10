var ChromeStorage = chrome.storage.local;
var ChromeLog = (msg) => {
  chrome.tabs.executeScript({
    code: `console.log("${msg}")`
  });
};

chrome.browserAction.onClicked.addListener(function (tab) {
  ChromeStorage.set({ activeTab: { id: tab.id } });
  chrome.tabs.executeScript(null, { file: "dist/bundle.js" });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  ChromeLog(tabId)
  if (changeInfo.status == "complete" && tab.active) {
    var storeKey = "firelogs_" + tabId;
    ChromeLog(storeKey)
    ChromeStorage.get(storeKey, function (data) {
      if (data[storeKey]) {
        chrome.tabs.executeScript(null, { file: "dist/bundle.js" });
        ChromeStorage.set({ [storeKey]: null });
      }
    });
  }
});
