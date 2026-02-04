const enableCheckbox = document.querySelector("#enable-plugin");
const stickyHeaderCheckbox = document.querySelector("#sticky-actions-header");

chrome.storage.sync.get(["pluginEnabled", "stickyActionsHeader"], (result) => {
  enableCheckbox.checked = result.pluginEnabled ?? true;
  stickyHeaderCheckbox.checked = result.stickyActionsHeader ?? true;
});

enableCheckbox.addEventListener("change", (event) => {
  chrome.storage.sync.set({ pluginEnabled: event.target.checked });
});

stickyHeaderCheckbox.addEventListener("change", (event) => {
  chrome.storage.sync.set({ stickyActionsHeader: event.target.checked });
});
