import ChromeUtils from "../shared/chrome";
import RUID from "../shared/uuid";
import { injectResponseScript } from "../shared/inject-response";

/**
 * Inject the script for log the response
 */
const interceptXHR = () => {
  const xhrOverrideScript = document.createElement("script");
  xhrOverrideScript.type = "text/javascript";
  xhrOverrideScript.id = "__firelogs_xhr_override_script";
  xhrOverrideScript.innerHTML = injectResponseScript(RUID);
  document.head.appendChild(xhrOverrideScript);
};

ChromeUtils.storage.get("activeTab", ({ activeTab }) => {
  if (activeTab) {
    const existCondition = setInterval(() => {
      if (document.head) {
        clearInterval(existCondition);
        interceptXHR();
      }
    }, 100); // check every 100 ms
  }
});
