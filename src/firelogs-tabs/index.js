import "./firelogs-tabs.scss";

import Storage from "../shared/store";

class FirelogsTabs {
  /**
   */
  constructor() {
    this.renderContainer();
    document.getElementById("reload").addEventListener("click", () => {
      this.getData();
    });
  }

  /**
   * A method was used to create the container and append it to the root.
   * Like a treditional reactDOM render
   */
  // eslint-disable-next-line class-methods-use-this
  renderContainer() {
    document.getElementById("root").innerHTML = `<div class="container">
    <button id="reload">
      Reload
    </button>
    <pre>
      <code></code>
    </pre>
  </div>`;
  }

  // eslint-disable-next-line class-methods-use-this
  async getData() {
    const data = (await Storage.get("firelogs_requests")) || {};
    document.querySelector("pre code").innerHTML = JSON.stringify(data);
    data.kl = { id: "Naveen" };
    await Storage.set("firelogs_requests", data);
  }
}

// eslint-disable-next-line no-unused-vars
const fireLogsTab = new FirelogsTabs();
