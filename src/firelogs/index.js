console.log("FireLogs is running ...");
import jQuery from "jquery";
import * as _ from "jqueryui";
import ChromeUtils from "../shared/chrome";
import "./styles.scss";
import logo from "../../images/logo.png";
import Transmission from "../shared/transmission";
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
      ele
        .find(".__firelogs-count")
        .hide()
        .text(firelogsCount.count)
        .show("highlight", {}, 200);
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
        </div>
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
      Transmission.send("open-firelogs-tab");
    });
  }
  bindAddCounterEvent() {
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
                count: firelogsCount.count+1
              }
            },
            () => {
              this.showCount();
            }
          );
        });
      });
  }
}
const firelogs = new Firelogs();

setTimeout(() => {
  Transmission.send("open-firelogs-tab:hidden-mode");
}, 0);
