import ChromeUtils from "../shared/chrome";
import RUID from "../shared/uuid";
import { injectResponseScript } from "../shared/inject-response";

ChromeUtils.storage.get("activeTab", function ({ activeTab }) {
  if (activeTab) {
    var existCondition = setInterval(function () {
      if (document.head) {
        clearInterval(existCondition);
        interceptXHR();
      }
    }, 100); // check every 100 ms
  }
});
/**
 * Inject the script for log the response
 */
export function interceptXHR() {
  var xhrOverrideScript = document.createElement("script");
  xhrOverrideScript.type = "text/javascript";
  xhrOverrideScript.id = "__firelogs_xhr_override_script";
  xhrOverrideScript.innerHTML = injectResponseScript(RUID);
  document.head.appendChild(xhrOverrideScript);
}
