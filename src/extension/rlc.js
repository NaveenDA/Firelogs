import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestProcessor from "../shared/request-processor";

class RequestLifeCycle {
  static async onBeforeSendHeaders(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "before");
      let code = JSON.stringify(details);
      // chrome.tabs.executeScript({
      //   code: `
      //     window.localStorage.setItem('before_${details.requestId}', \`${code}\`)
      //   `
      // });
    }
  }

  static async onBeforeRequest(details, activeTabId, transmissionPort){
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "beforeRequest");
    }
  }
  static async processRequest() {}

  static async onCompleted(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "complete");

      let code = JSON.stringify(details);
      // chrome.tabs.executeScript({
      //   code: `
      //     window.localStorage.setItem('complete_${details.requestId}', \`${code}\`)
      //   `
      // });
      Events.addCount();
    }
  }

  static async onErrorOccurred(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "error");

      let code = JSON.stringify(details);
      // chrome.tabs.executeScript({
      //   code: `
      //     window.localStorage.setItem('error_${details.requestId}', \`${code}\`)
      //   `
      // });
      Events.addCount();
    }
  }
  static destory(tabId) {}
}

export default RequestLifeCycle;
