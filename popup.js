const checkbox = document.querySelector("#enable-plugin");
chrome.storage.sync.get(["pluginEnabled"], (result) => {
  const isEnabled = result.pluginEnabled ?? true;
  checkbox.checked = isEnabled;
});
checkbox.addEventListener("change", (event) => {
  const isEnabled = event.target.checked;
  chrome.storage.sync.set({ pluginEnabled: isEnabled });
});
