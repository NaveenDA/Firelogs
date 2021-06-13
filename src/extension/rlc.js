import ChromeUtils from "../shared/chrome";
import Events from "../shared/events";

class RequestLifeCycle {
  static onCompleted(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      ChromeUtils.count("onCompleted");
      ChromeUtils.log(details);
      Events.addCount();
    }
  }

  static onErrorOccurred(details, activeTabId, transmissionPort) {
    if (
      details.tabId &&
      activeTabId == details.tabId &&
      details.type === "xmlhttprequest"
    ) {
      ChromeUtils.count("onErrorOccurred");
      ChromeUtils.log(details);
      Events.addCount();
    }
  }
  static destory(tabId) {}
}

export default RequestLifeCycle;
