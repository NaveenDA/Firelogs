import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestLifeCycle from "./rlc";

let firelogsTab;
let transmissionPort;
let activeTabId;
let activeTabContext;

/**
 * Add RLC callback methods easier
 * It is used to bind and unbind the events
 */
const onCompleted = (details) => {
  getActiveTabID((id) => {
    RequestLifeCycle.onCompleted(details, id, transmissionPort);
  });
};
/**
 * A method for get the current Activite tab from chrome storage
 * Memozied method was added, so performance will be better.
 */
let currentTab;
const getActiveTabID = (callback) => {
  if (currentTab) {
    callback(currentTab);
  } else {
    ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
      currentTab = activeTab.id;
    });
    callback(currentTab);
  }
};
/**
 * Events for Page Load
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    var currentTab = { id: tab.id };

    ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
      if (activeTab) {
        if (activeTab.id === currentTab.id) {
          activeTabContext = tab;
          ChromeUtils.log({ activeTabContext });
          activeTabId = tab.id;
          Events.loadFireLogs(tab.id);
          ChromeUtils.log({ load: 1 });
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
  var currentTab = { id: tab.id };
  ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
    if (activeTab) {
      if (activeTab.id === currentTab.id) {
        /**
         * Destory the Firelogs */
        chrome.tabs.remove(firelogsTab.id);
      } else {
        Events.loadFireLogs(tab.id);
        ChromeUtils.log({ load: 2 });
      }
    } else {
      Events.loadFireLogs(tab.id);
      ChromeUtils.log({ load: 3 });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message) {
    case "open-firelogs-tab:hidden-mode":
    case "open-firelogs-tab":
      if (firelogsTab) {
        if (message === "open-firelogs-tab") {
          chrome.tabs.update(firelogsTab.id, { selected: true });
          chrome.windows.update(firelogsTab.windowId, { focused: true });
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

            /**
             * On Request Error
             */
            chrome.webRequest.onErrorOccurred.addListener(
              (details) => {
                RequestLifeCycle.onErrorOccurred(
                  details,
                  activeTabId,
                  transmissionPort
                );
              },
              { urls: ["<all_urls>"] },
              ["extraHeaders"]
            );
          }
        );
      }
    default:
      return true;
  }
});
