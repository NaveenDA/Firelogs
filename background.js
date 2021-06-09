let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// chrome.scripting.executeScript

// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null, {file: "bundle.js"});
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: "dist/bundle.js"
  });
});


// document.addEventListener("DOMContentLoaded", function() {

// });