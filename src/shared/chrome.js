class ChromeUtils {
    /**
     * A method is used to Store the Data on Extenision Storage
     */
  static storage = chrome.storage.local;

  /**
   * A method is used to print log on the browser console from the extension
   * @param {string|object} msg Message need to print
   */
  static log = (msg) => {
    if (typeof msg === "object") {
      msg = JSON.stringify(msg);
    }
    chrome.tabs.executeScript({
      code: "console.log(`" + msg + "`)"
    });
  };
  /**
   * A method is used to print count on the browser console from the extension
   * @param {string|object} msg Message need to print
   */
  static count = (msg) => {
    if (typeof msg === "object") {
      msg = JSON.stringify(msg);
    }
    chrome.tabs.executeScript({
      code: "console.count(`" + msg + "`)"
    });
  };

  
}


export default ChromeUtils;

