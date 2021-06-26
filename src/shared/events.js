import ChromeUtils from "./chrome";
import RUID from "./uuid";
import { logiy } from "../core";

/**
 * @class Events
 * Handle all custom event with in extension
 */
class Events {
  static RequestCount = null;
  /**
   * Load Firelogs
   * @param {string} id Tab ID for loading the firelogs
   * @param {boolean} inject the content script or not
   */
  static loadFireLogs(id, inject) {
    /**
     * Set Current ID to the Store
     */
    ChromeUtils.storage.set({ activeTab: { id: id } });
    /**
     * Load the Scripts from dist
     */
    chrome.tabs.executeScript(null, { file: "dist/firelogs-icon.js" }, () => {
      chrome.tabs.executeScript(null, { file: "dist/content.js" });
      /**
       * Inject the scripts, if it is not inject via content script
       */
    });
  }

  static destoryFireLogs(activeTabContext) {
    /**
     * Remove the Firelogs
     */
    ChromeUtils.storage.remove("activeTab", () => {
      logiy({ msg: "Active Tab Destoryed" });
      ChromeUtils.storage.remove("firelogsCount", () => {
        logiy({ msg: "Firelogs count destoryed" });
        /**
         * Remove the element from the  build
         */
        if (activeTabContext) {
          logiy({
            mdg: "Switch to active tab"
          });
          chrome.tabs.update(activeTabContext.id, { selected: true });
          chrome.windows.update(activeTabContext.windowId, { focused: true });
        }
        logiy({
          msg: "Icon was removed"
        });
        chrome.tabs.executeScript({
          code: `
            try{
              document.querySelector('#__firelogs').remove();
            }catch(e){}
            `
        });
      });
    });
  }
  /**
   * A method for increase the count from background script to content scripts
   * @todo: Change callback based system to much better system
   */
  static addCount() {
    const add = () => {
      chrome.tabs.executeScript({
        code: `
            try{
              let ele = document.querySelector('#__firelogs .__firelogs-count');
              ele.innerText=${Events.RequestCount};
            }catch(e){}
          `
      });
    };
    if (Events.RequestCount) {
      Events.RequestCount += 1;
      add();
      ChromeUtils.storage.set({
        firelogsCount: {
          count: Events.RequestCount
        }
      });
    } else {
      ChromeUtils.storage.get("firelogsCount", function ({ firelogsCount }) {
        if (!firelogsCount) {
          firelogsCount = {
            count: 0
          };
        }
        Events.RequestCount = firelogsCount.count + 1;
        add();
      });
    }
  }
}

export default Events;
