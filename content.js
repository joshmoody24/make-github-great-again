function flex() {
  const text = "⭐ Make GitHub Great Again ⭐";
  const colors = ["#c81d25", "#f7ede2", "#3454d1"];

  let styledText = "";
  let styleArgs = [];

  for (let i = 0; i < text.length; i++) {
    const char =
      Math.random() > 0.5 ? text[i].toUpperCase() : text[i].toLowerCase();
    styledText += "%c" + char;

    const color = colors[i % colors.length];

    styleArgs.push(`
    color: ${color};
    font-weight: bold;
  `);
  }
  console.log(styledText, ...styleArgs);
}

function debugLog(...args) {
  console.debug("MGGA:", ...args);
}

function onClickHandler(e) {
  const link = e.target.closest("a");
  if (!link) return;
  const prTabPattern = /\/pull\/\d+(?:\/(commits|checks|files))?\/?/;
  if (prTabPattern.test(link.href)) {
    e.preventDefault();
    window.location.href = link.href;
  }
}

function makeGithubGreatAgain() {
  debugLog("Enabling extension");
  document.addEventListener("click", onClickHandler, true);
}

function makeGithubBadAgain() {
  debugLog("Disabling Make GitHub Great Again extension");
  document.removeEventListener("click", onClickHandler, true);
}

function makeGitHubAsTheUserDesires() {
  chrome.storage.sync.get(["pluginEnabled"], (result) => {
    const isEnabled = result.pluginEnabled ?? true;
    if (isEnabled) {
      makeGithubGreatAgain();
    } else {
      makeGithubBadAgain();
    }
  });
}

function listenForStorageChanges() {
  chrome.storage.onChanged.addListener((changes, area) => {
    debugLog("Storage changed:", changes, area);
    if (area === "sync" && changes.pluginEnabled) {
      const isEnabled = changes.pluginEnabled.newValue;
      if (isEnabled) {
        makeGithubGreatAgain();
      } else {
        makeGithubBadAgain();
      }
    }
  });
}

flex();
makeGitHubAsTheUserDesires();
listenForStorageChanges();
