import jQuery from "jquery";
import './styles.css';
import logoX from "../images/icon128.png";

var styles = "";
const FireLogsContainer = `
<div id="__firelogs-styles"></div>
<div class="__firelog-container">
  <img src="${logoX}" class="__firelog-logo" />
  <span class="__firelog-count">12</span>
</div>
`;

const FireLogsContainerStyles = `
<style>${styles}</style>
`;

const element = document.createElement("div");
element.id = "__firelog";

document.body.appendChild(element);

setTimeout(() => {
  const ele = jQuery("#__firelog");
  ele.html(FireLogsContainer);
  ele.find("#__firelogs-styles").html(FireLogsContainerStyles);
}, 500);
