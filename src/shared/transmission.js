const { chrome } = window;
class Transmission {
  /**
   * Send a message over through the chrome runtime message channel
   * @param {string} message
   * @param {Function} callback
   */
  static send(message, callback) {
    chrome.runtime.sendMessage(message, (response) => {
      //  Got an asynchronous response with the data from the background
      if (typeof callback === "function") {
        callback(response);
      }
    });
  }

  /**
   * Receive a message through the chrome runtime message channel
   */
  static receive() {}

  /**
   * Post message to tab
   * @param {Object} port Chrome's Runtime Connection
   * @param {Object} message Message needs to sent
   */
  static postMessage(port, message) {
    try {
      return port.postMessage(message);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e.message);
      return e.message;
    }
  }
}

export default Transmission;
