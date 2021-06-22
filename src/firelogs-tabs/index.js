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

  async getData() {
    let data = (await Storage.get("firelogs_requests")) || {};
    document.querySelector("pre code").innerHTML = JSON.stringify(data);
    data["kl"] = { id: "Naveen" };
    await Storage.set("firelogs_requests", data);
  }
}

let fireLogsTab = new FirelogsTabs();
