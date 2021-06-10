import jQuery from "jquery";
import { draggable } from "jqueryui";
import "./styles.scss";
import logo from "../images/logo.png";
import Storage from "./store";
const ChromeStorage = chrome.storage.local;

class firelogs {
  tabid = null;
  storeKey = null;

  constructor(id) {
    console.log("New instance of firelogs is created for Tab ID " + id);
    this.tabid = id;
    this.storeKey = "count_" + id;
    this.syncChromeStore();
    /**
     * If the already firelogs div is present, then we need destory the instance
     */
    if (document.body.contains(document.getElementById("__firelogs"))) {
      this.destory();
    } else {
      this.injectHtml();
      this.bindEvents();
      this.showfirelogs();
    }
  }

  syncChromeStore() {
    let storeName = "firelogs_" + this.tabid;
    ChromeStorage.get(storeName, function (data) {
      if (data[storeName]) {
        ChromeStorage.set({ [storeName]: null });
      } else {
        ChromeStorage.set({ [storeName]: { start: true } });
      }
    });
  }

  injectHtml() {
    const firelogsContainer = `
        <div id="add-count"></div>
        <div class="__firelogs-container" style="display:none">
          <img src="${logo}" class="__firelogs-logo" id="logo" />
          <span class="__firelogs-count">0</span>
        </div>
        `;

    const element = document.createElement("div");
    element.id = "__firelogs";
    document.body.appendChild(element);
    document.getElementById("__firelogs").innerHTML = firelogsContainer;
  }

  showfirelogs() {
    let ele = jQuery("#__firelogs");
    ChromeStorage.get("firestorePosition", function ({ firestorePosition }) {
      if (firestorePosition) {
        ele.find(".__firelogs-container").css({
          left: firestorePosition.left || 12,
          top: firestorePosition.top || 12
        });
      }
      ele.find(".__firelogs-container").fadeIn("slow");
    });
  }

  bindEvents() {
    const ele = jQuery("#__firelogs");

    /** Draggable Events */
    ele.find(".__firelogs-container").draggable({
      stop: (event, ui) => {
        ChromeStorage.set({ firelogsPosition: ui.position });
      }
    });

    /** Add Count Event */
    ele.find("#add-count").on("click", async () => {
      let key = this.storeKey;
      let count = await Storage.get(key);
      let newCount = ++count
      await Storage.set(key, newCount);
      ele.trigger("updateCount");
    });

    /** Update count event to the view */
    ele.on("updateCount", async () => {
      let key = this.storeKey;
      var count = await Storage.get(key);
      ele
        .find(".__firelogs-count")
        .hide()
        .text(count)
        .show("highlight", {}, 200);
    });
  }

  destory() {
    document.getElementById("__firelogs").remove();
  }
}
let id = null;
let firelogsInstance;
ChromeStorage.get("activeTab", ({ activeTab }) => {
  id = activeTab.id;
  firelogsInstance = new firelogs(id);
});

setTimeout(() => {
  jQuery("#__firelogs").trigger("updateCount");
}, 500);
