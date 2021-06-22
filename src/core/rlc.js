import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestProcessor from "./request-processor";

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

  static async onBeforeRequest(details, activeTabId, transmissionPort) {
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
  /**
   * For the response, things got tricky
   * It give full data instead single item,
   * Need to find item from group and update on the request pool
   */
  static onRespone(details) {
    RequestProcessor.process(details, "response");

    // chrome.tabs.executeScript({
    //   code: `
    //     window.localStorage.setItem('error_${details.requestId}', \`${code}\`)
    //   `
    // });
  }
}

export default RequestLifeCycle;
