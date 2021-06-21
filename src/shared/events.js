import ChromeUtils from "./chrome";
import Transmission from "./transmission";

class Events {
    /**
     * Load Firelogs
     * @param {string} id Tab ID for loading the firelogs
     */
    static loadFireLogs(id) {
        ChromeUtils.log("🚀Firelogs is loading... on tab_id:" + id);
        /**
         * Set Current ID to the Store
         */
        ChromeUtils.storage.set({ activeTab: { id: id } });
        /**
         * Load the Scripts from dist
         */
        chrome.tabs.executeScript(
            null,
            { file: "dist/firelogs-icon.js" },
            () => {
                ChromeUtils.log("Script is loaded...");
            }
        );
    }

    static destoryFireLogs(activeTabContext) {
        ChromeUtils.log("💥Destorying firelogs..." + activeTabContext?.id);
        /**
         * Remove the Firelogs
         */
        ChromeUtils.storage.remove("activeTab");
        ChromeUtils.storage.remove("firelogsCount");
        /**
         * Remove the element from the  build
         */
        if (activeTabContext) {
            chrome.tabs.update(activeTabContext.id, { selected: true });
            chrome.windows.update(activeTabContext.windowId, { focused: true });
        }

        chrome.tabs.executeScript({
            code: `
      try{
        document.querySelector('#__firelogs').remove();
      }catch(e){}
      `
        });
    }
    /**
     * A method for increase the count from background script to content scripts
     */
    static addCount() {
        /** Welcome to the Callback Hell👹 */
        ChromeUtils.storage.get("firelogsCount", function ({ firelogsCount }) {
            if (!firelogsCount) {
                firelogsCount = {
                    count: 0
                };
            }
            ChromeUtils.storage.set(
                {
                    firelogsCount: {
                        count: firelogsCount.count + 1
                    }
                },
                () => {
                    chrome.tabs.executeScript({
                        code: `
              try{
                document.querySelector('#__firelogs #add-count').click();
              }catch(e){}
            `
                    });
                }
            );
        });
    }
}

export default Events;
