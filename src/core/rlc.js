/* eslint-disable no-unused-vars */
import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";
import RequestProcessor from "./request-processor";

class RequestLifeCycle {
  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} _transmissionPort
   */
  static async onBeforeSendHeaders(details, activeTabId, _transmissionPort) {
    if (
      details.tabId &&
      activeTabId === details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "before");
    }
  }

  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} _transmissionPort
   */
  static async onBeforeRequest(details, activeTabId, _transmissionPort) {
    if (
      details.tabId &&
      activeTabId === details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "beforeRequest");
    }
  }

  /**
   *
   * @param {*} details
   * @param {*} activeTabId
   * @param {*} _transmissionPort
   */
  static async onCompleted(details, activeTabId, _transmissionPort) {
    if (
      details.tabId &&
      activeTabId === details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      RequestProcessor.process(details, "complete");
      Events.addCount();
    }
  }

  /**
   *
   * @param {Object} details Error Response
   * @param {Number} activeTabId Current Active Tab
   * @param {Port} _transmissionPort Chrome Port
   */
  static async onErrorOccurred(details, activeTabId, _transmissionPort) {
    if (
      details.tabId &&
      activeTabId === details.tabId &&
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
   * @param {Object} details
   */
  static onRespone(details) {
    RequestProcessor.process(details, "response");
  }
}

export default RequestLifeCycle;
