class Transmission {
  /**
   * Send a message over through the chrome runtime message channel
   * @param {string} message
   * @param {Function} callback
   */
  static send(message, callback) {
    chrome.runtime.sendMessage(message, (response) => {
      //  Got an asynchronous response with the data from the background
      callback && callback(response);
    });
  }

  /**
   * Receive a message through the chrome runtime message channel
   */
  static receive() {}
}

export default Transmission;
