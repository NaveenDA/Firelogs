import ChromeUtils from "../shared/chrome";

ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
  if (activeTab) {
    console.log(activeTab)
    var existCondition = setInterval(function () {
      if (document.head) {
        console.log("Exists!");
        clearInterval(existCondition);
        console.log("Now load those");
        interceptData();
        // doTheRestOfTheStuff(parameters);
      }
    }, 100); // check every 100
  }
});

function interceptData() {
  var xhrOverrideScript = document.createElement("script");
  xhrOverrideScript.type = "text/javascript";
  xhrOverrideScript.innerHTML = `
     window.__firelogsResponse={};
    var fireIndex = 0;
      (function() {
  console.log('Script was Running')
  
        var XHR = XMLHttpRequest.prototype;
        var send = XHR.send;
        var open = XHR.open;
        XHR.open = function(method, url) {
            this.url = url; // the request url
            return open.apply(this, arguments);
        }
        XHR.send = function() {
            this.addEventListener('load', function() {
              __firelogsResponse[fireIndex] = this.response;
              fireIndex++;
            });
            return send.apply(this, arguments);
        };
      })();
      `;
  document.head.appendChild(xhrOverrideScript);
}

document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
  console.log(window.__firelogsResponse)

});
