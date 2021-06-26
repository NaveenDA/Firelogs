/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import "./styles.scss";

import ChromeUtils from "../shared/chrome";
import Transmission from "../shared/transmission";
import draggable from "../shared/draggable";
import logo from "../../images/logo.png";

const { chrome } = window;
/**
 * @class FirelogsIcons
 */
class FirelogsIcon {
  // eslint-disable-next-line
  constructor() {
    this.injectHtml();
    this.showContainer();
    this.showCount();
    this.loadDraggableEvents();
    this.bindFirelogsTabEvent();
    this.bindAddCounterEvent();
    this.bindResponseResolver();
  }

  /**
   * A method for position the UI in last session's position
   */
  showContainer() {
    const ele = document.querySelector("#__firelogs");
    ChromeUtils.storage.get("firelogsPosition", ({ firelogsPosition }) => {
      if (!firelogsPosition) {
        /**
         * Default Position
         */
        firelogsPosition = {
          left: "12px",
          top: "12px"
        };
      }
      const container = ele.querySelector(".__firelogs-container");
      container.style.left = firelogsPosition.left;
      container.style.top = firelogsPosition.top;
      container.classList.add("show");
      container.classList.remove("hide");
    });
  }

  /**
   * Get the count from Store and show the count
   */
  showCount() {
    const ele = document.querySelector("#__firelogs .__firelogs-count");
    ChromeUtils.storage.get("firelogsCount", ({ firelogsCount }) => {
      if (!firelogsCount) {
        firelogsCount = {
          count: 0
        };
      }
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
        <div id="__firelogs-response"></div>
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
    let event;
    if (window.CustomEvent && typeof window.CustomEvent === "function") {
      event = new CustomEvent(newEvent, { detail: data });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(newEvent, true, true, data);
    }

    el.dispatchEvent(event);
  }

  /**
   *
   */
  bindFirelogsTabEvent() {
    const ele = document.querySelector("#__firelogs .__firelogs-container");
    ele.addEventListener(
      "click",
      () => {
        Transmission.send("open-firelogs-tab");
      },
      false
    );
  }

  /**
   *
   */
  bindAddCounterEvent() {
    const self = this;
    const addCount = () => {
      ChromeUtils.storage.get("firelogsCount", ({ firelogsCount }) => {
        if (!firelogsCount) {
          // eslint-disable-next-line no-param-reassign
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

  bindResponseResolver() {
    const el = document.querySelector("#data-container-firelogs");
    const MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(() => {
      // eslint-disable-next-line no-console
      console.log("fetch-response");
      Transmission.send("fetch-response");
    });
    observer.observe(el, {
      subtree: true,
      childList: true
    });
  }
}
/**
 * Create a instance of FirelogsIcon
 */
// eslint-disable-next-line no-unused-vars
const firelogIconInstance = new FirelogsIcon();

setTimeout(() => {
  Transmission.send("open-firelogs-tab:hidden-mode");
}, 0);

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // eslint-disable-next-line no-console
  console.log({ msg });
  if (msg?.cmd === "give-response") {
    const element = document.querySelector("#data-container-firelogs");
    let data = element.innerText;
    data = JSON.parse(data);
    sendResponse(data);
  }
});
