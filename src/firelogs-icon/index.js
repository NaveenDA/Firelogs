console.log("FireLogs is running ...");

import "./styles.scss";

import * as _ from "jqueryui";
import jQuery from "jquery";

import ChromeUtils from "../shared/chrome";
import DataStorage from "../shared/data-store";
import Transmission from "../shared/transmission";
import logo from "../../images/logo.png";

let firelogsGlobalCount = 0;
class Firelogs {
  static version = "1.0.0";
  constructor() {
    this.injectHtml();
    this.showContainer();
    this.showCount();
    this.loadDraggableEvents();
    this.bindFirelogsTabEvent();
    this.bindAddCounterEvent();
  }
  /**
   * A method for position the UI in last session's position
   */
  showContainer() {
    let ele = jQuery("#__firelogs");
    ChromeUtils.storage.get(
      "firelogsPosition",
      function ({ firelogsPosition }) {
        if (!firelogsPosition) {
          /**
           * Default Position
           */
          firelogsPosition = {
            left: 12,
            top: 12
          };
        }
        ele.find(".__firelogs-container").css({
          left: firelogsPosition.left,
          top: firelogsPosition.top
        });
        ele.find(".__firelogs-container").fadeIn("slow");
      }
    );
  }
  showCount() {
    let ele = jQuery("#__firelogs");
    ChromeUtils.storage.get("firelogsCount", function ({ firelogsCount }) {
      if (!firelogsCount) {
        firelogsCount = {
          count: 0
        };
      }
      firelogsGlobalCount = firelogsCount.count;
      ele.find(".__firelogs-count").hide().text(firelogsCount.count).show();
    });
  }
  /**
   * A method for inject the HTML in the document
   */
  injectHtml() {
    const firelogsContainer = `
        <div id="add-count"></div>
        <div class="__firelogs-container" style="display:none">
          <img src="${logo}" class="__firelogs-logo" alt="Firelogs Logo" id="logo" />
          <span class="__firelogs-count">0</span>
          <pre id="data-container-firelogs"></pre>
        </div>
        <div id="__firelogs-script"></div>
        `;
    const element = document.createElement("div");
    element.id = "__firelogs";
    document.body.appendChild(element);
    document.getElementById("__firelogs").innerHTML = firelogsContainer;
  }
  /**
   *
   */
  loadDraggableEvents() {
    const ele = jQuery("#__firelogs");
    /** Draggable Events */
    ele.find(".__firelogs-container").draggable({
      stop: (event, ui) => {
        ChromeUtils.storage.set({
          firelogsPosition: ui.position
        });
      }
    });
  }
  bindFirelogsTabEvent() {
    const ele = jQuery("#__firelogs");
    ele.find(".__firelogs-container").on("click", () => {
      Transmission.send("fetch-response");
    });
  }
  bindAddCounterEvent() {
    let self = this;
    const ele = jQuery("#__firelogs");
    ele
      .find("#add-count")
      .off("click")
      .on("click", async () => {
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
              self.showCount();
            }
          );
        });
      });
  }
}
const _firelogs = new Firelogs();

setTimeout(() => {
  Transmission.send("open-firelogs-tab:hidden-mode");
}, 0);

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  if (msg?.cmd === "give-response") {
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    // sendResponse(document.all[0].outerHTML);
    console.log("Yeah this is from background");
    var element = document.querySelector("#data-container-firelogs");
    var data = element.innerText;
    data = JSON.parse(data);
    sendResponse(data);
  }
});
