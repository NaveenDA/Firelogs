import "./styles.scss";

import ChromeUtils from "../shared/chrome";
import Transmission from "../shared/transmission";
import draggable from "../shared/draggable";
import logo from "../../images/logo.png";

console.log("FireLogs is running ...");

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
    let ele = document.querySelector("#__firelogs");
    ChromeUtils.storage.get(
      "firelogsPosition",
      function ({ firelogsPosition }) {
        if (!firelogsPosition) {
          /**
           * Default Position
           */
          firelogsPosition = {
            left: "12px",
            top: "12px"
          };
        }
        let container = ele.querySelector(".__firelogs-container");
        container.style.left = firelogsPosition.left;
        container.style.top = firelogsPosition.top;
        container.classList.add("show");
        container.classList.remove("hide");
      }
    );
  }
  showCount() {
    let ele = document.querySelector("#__firelogs .__firelogs-count");
    ChromeUtils.storage.get("firelogsCount", function ({ firelogsCount }) {
      if (!firelogsCount) {
        firelogsCount = {
          count: 0
        };
      }
      firelogsGlobalCount = firelogsCount.count;
      ele.classList.remove("hide");
      ele.classList.add("show");
      ele.innerText = firelogsCount.count;
    });
  }
  /**
   * A method for inject the HTML in the document
   */
  injectHtml() {
    const firelogsContainer = `
        <div id="add-count"></div>
        <div class="__firelogs-container hide" >
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
    const ele = document.querySelector("#__firelogs .__firelogs-container");
    /** Draggable Events */
    draggable(ele, (position) => {
      ChromeUtils.storage.set({
        firelogsPosition: position
      });
    });
  }
  /**
   * A custom hook to trigger the cutom event
   * @param {HTMLElement} el
   * @param {String} newEvent
   * @param {Object} data
   */
  trigger(el, newEvent, data = {}) {
    var event;
    if (window.CustomEvent && typeof window.CustomEvent === "function") {
      event = new CustomEvent(newEvent, { detail: data });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(newEvent, true, true, data);
    }

    el.dispatchEvent(event);
  }

  bindFirelogsTabEvent() {
    const ele = document.querySelector("#__firelogs .__firelogs-container");
    ele.addEventListener(
      "click",
      () => {
        Transmission.send("fetch-response");
      },
      false
    );
  }
  bindAddCounterEvent() {
    let self = this;
    const addCount = () => {
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
    };
    const ele = document.querySelector("#__firelogs #add-count");
    ele.addEventListener("click", addCount);
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
