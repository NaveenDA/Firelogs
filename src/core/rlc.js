import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestProcessor from "./request-processor";

class RequestLifeCycle {
  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} transmissionPort
   */
  static async onBeforeSendHeaders(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "before");
    }
  }
  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} transmissionPort
   */
  static async onBeforeRequest(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "beforeRequest");
    }
  }
  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} transmissionPort
   */
  static async onCompleted(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "complete");
      ChromeUtils.count("addCount");
      Events.addCount();
    }
  }
  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} transmissionPort
   */
  static async onErrorOccurred(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "error");
      ChromeUtils.count("addCount");
      Events.addCount();
    }
  }

  //  For the response, things got tricky
  //  It give full data instead single item,
  //  Need to find item from group and update on the request pool
  /**
   *
   * @param {*} details
   */
  static onRespone(details) {
    RequestProcessor.process(details, "response");
  }
}

export default RequestLifeCycle;
