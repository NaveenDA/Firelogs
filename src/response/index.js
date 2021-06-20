import ChromeUtils from "../shared/chrome";
import uuid from "../shared/uuid";
import DataStorage from "../shared/data-store";

ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
  if (activeTab) {
    console.log(activeTab);
    var existCondition = setInterval(function () {
      if (document.head) {
        console.log("Exists!");
        clearInterval(existCondition);
        console.log("Now load those");
        interceptData();
      }
    }, 100); // check every 100 ms
  }
});

function interceptData() {
  var xhrOverrideScript = document.createElement("script");
  xhrOverrideScript.type = "text/javascript";
  let extId = chrome.runtime.id;
  xhrOverrideScript.innerHTML = `
  window.__firelogsResponse = {};
  // Get the copy of UUID from the shared folder
  var uuid = ${uuid};
  // Get the data storage from the shared folder
  ${DataStorage};
  var dataStorage = new DataStorage();
  var fireIndex = 0;
  (function () {
    console.log("Script was Running");
    console.log(uuid())
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function (method, url) {
      this.url = url; // the request url
      this.uuid = uuid();
      return open.apply(this, arguments);
    };
    XHR.send = function () {
      this.addEventListener("load", function () {
        __firelogsResponse[fireIndex] = this.response;

        var el = document.querySelector("#data-container-firelogs");
        if (el) {
          el.innerHTML = JSON.stringify(__firelogsResponse);
          console.log("Data has been stored " + fireIndex);
        } else {
          console.count("Element Not Fount");
        }
        fireIndex++;
      });
      return send.apply(this, arguments);
    };
  })();  
      `;
  document.head.appendChild(xhrOverrideScript);
}
