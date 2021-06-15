import ChromeUtils from "./chrome";

class Transmission {
  /**
   * Send a message over through the chrome runtime message channel
   * @param {string} message
   * @param {Function} callback
   */
  static send(message, callback) {
    // ChromeUtils.log("Sending a message ...");
    chrome.runtime.sendMessage(message, (response) => {
      //  Got an asynchronous response with the data from the background
      console.log("received user data", response);
      callback && callback(response);
    });
  }

  /**
   * Receive a message through the chrome runtime message channel
   */
  static receive() {}
}

export default Transmission;
