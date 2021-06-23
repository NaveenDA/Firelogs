import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestLifeCycle from "./rlc";

let firelogsTab;
let transmissionPort;
let activeTabId;
let activeTabContext;
let activeTabIDCache;

const logiy = (msg) => {
  try {
    ChromeUtils.log("::::::::::::: LOGIY :::::::::::");
    ChromeUtils.log(msg);
  } catch (error) {}
};

/**
 * Add RLC callback methods easier
 * It is used to bind and unbind the events
 */
const onCompleted = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onCompleted(details, id, transmissionPort);
  });
};
const onBeforeSendHeaders = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onBeforeSendHeaders(details, id, transmissionPort);
  });
};
const onErrorOccurred = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onErrorOccurred(details, id, transmissionPort);
  });
};
const onBeforeRequest = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onBeforeRequest(details, id, transmissionPort);
  });
};
const onRespone = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onRespone(details, id, transmissionPort);
  });
};

/**
 * A method for get the current Activite tab from chrome storage
 * Memozied method was added, so performance will be better.
 */
const getActiveTabID = (callback) => {
  if (!activeTabIDCache) {
    ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
      if (activeTab) {
        activeTabIDCache = activeTab.id;
      } else {
        ChromeUtils.log(
          "We have doesn't have any active ID still, how get here? "
        );
      }
    });
  }
  callback(activeTabIDCache);
};
/**
 * Events for Page Load
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    activeTabId = { id: tab.id };

    ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
      if (activeTab) {
        if (activeTab.id === activeTabId.id) {
          activeTabContext = tab;
          activeTabId = tab.id;
          Events.loadFireLogs(tab.id);
        }
      } else {
        /**
         * DO NOTHING BOX
         */
      }
    });
  }
});

/**
 * Events for User Click
 */
chrome.browserAction.onClicked.addListener(function (tab) {
  activeTabContext = tab;
  activeTabId = { id: tab.id };

  ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
    if (activeTab) {
      if (activeTab.id === activeTabId.id) {
        if (firelogsTab) {
          /**
           * Destory the Firelogs */
          chrome.tabs.remove(firelogsTab.id);
        } else {
          // We need to destory the data from storage
          Events.destoryFireLogs();
        }
      } else {
        Events.loadFireLogs(tab.id, true);
      }
    } else {
      Events.loadFireLogs(tab.id, true);
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message) {
    case "fetch-response":
      try {
        var id = activeTabIDCache;
        chrome.tabs.sendMessage(
          id,
          {
            cmd: "give-response"
          },
          (data) => {
            onRespone(data);
            return true;
          }
        );
      } catch (error) {}
      break;
    case "open-firelogs-tab:hidden-mode":
    case "open-firelogs-tab":
      if (firelogsTab) {
        if (message === "open-firelogs-tab") {
          chrome.tabs.update(firelogsTab.id, { selected: true });
          chrome.windows.update(firelogsTab.windowId, {
            focused: true
          });
        }
      } else {
        chrome.tabs.create(
          {
            url: chrome.extension.getURL("dist/firelogs.html")
          },
          function (tab) {
            firelogsTab = tab;
            sendResponse(tab);

            // On Tab Destroy
            chrome.tabs.onRemoved.addListener(() => {
              firelogsTab = null;
              transmissionPort = null;
              activeTabId = null;

              ChromeUtils.storage.remove("firelogsCount");
              Events.destoryFireLogs(activeTabContext);
              activeTabContext = null;
              chrome.webRequest.onCompleted.removeListener(onCompleted);
              chrome.webRequest.onBeforeSendHeaders.removeListener(
                onBeforeSendHeaders
              );
              chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurred);
            });

            /*
             * ***********************************************
             *  Request Life Cycle Event
             * ************************************************
             */
            /**
             * on Request Compelete
             */
            chrome.webRequest.onCompleted.addListener(
              onCompleted,
              { urls: ["<all_urls>"] },
              ["responseHeaders"]
            );

            chrome.webRequest.onBeforeSendHeaders.addListener(
              onBeforeSendHeaders,
              { urls: ["<all_urls>"] },
              ["extraHeaders"]
            );

            chrome.webRequest.onBeforeRequest.addListener(
              onBeforeRequest,
              { urls: ["<all_urls>"] },
              ["requestBody"]
            );

            /**
             * On Request Error
             */
            chrome.webRequest.onErrorOccurred.addListener(
              onErrorOccurred,
              { urls: ["<all_urls>"] },
              ["extraHeaders"]
            );
          }
        );
      }
      return true;
    default:
      return true;
  }
});
