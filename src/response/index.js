import ChromeUtils from "../shared/chrome";
import RUID from "../shared/uuid";

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
  ${RUID};
  var fireIndex = 0;
  (function () {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function (method, url) {
      this.url = url; // the request url
      this.ruid = RUID.reqUUID(url);
      this.method = method;
      return open.apply(this, arguments);
    };
    XHR.send = function () {
      this.addEventListener("load", function () {
        var url = new URL(this.url, location);
        __firelogsResponse[this.ruid] = {
            url:url.pathname,
            method: this.method,
            ruid:this.ruid,
            response: this.response
        };
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
