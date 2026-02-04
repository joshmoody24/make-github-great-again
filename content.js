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

  // Ignore the refresh button on PR files changed diff page
  if (link.className?.includes("RefreshButton-module__refresh__")) {
    return;
  }

  const prTabPattern = /\/pull\/\d+(?:\/(commits|checks|files))?\/?/;
  if (prTabPattern.test(link.href)) {
    e.preventDefault();
    window.location.href = link.href;
  }
}

function makeGithubGreatAgain(options) {
  debugLog("Enabling extension, stickyActionsHeader:", options.stickyActionsHeader);
  document.addEventListener("click", onClickHandler, true);
  updateStickyHeader(options.stickyActionsHeader);
}

function makeGithubBadAgain() {
  debugLog("Disabling Make GitHub Great Again extension");
  document.removeEventListener("click", onClickHandler, true);
  updateStickyHeader(false);
}

// Sticky header for GitHub Actions pages
const STICKY_HEADER_STYLE_ID = "mgga-sticky-header";
const stickyHeaderState = {
  observer: null,
};

function updateHeaderHeight(header) {
  const value = header.offsetHeight + "px";
  debugLog("setting --mgga-header-height to:", value);
  document.documentElement.style.setProperty("--mgga-header-height", value);
}

function updateStickyHeader(enabled) {
  const existingStyle = document.getElementById(STICKY_HEADER_STYLE_ID);

  if (enabled) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = STICKY_HEADER_STYLE_ID;
      style.textContent = `
        .PageLayout-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bgColor-default);
        }
        .uxr_CheckRun-header {
          top: var(--mgga-header-height, 72px);
        }
        .uxr_CheckStep-header {
          top: calc(88px + var(--mgga-header-height, 72px)) !important;
        }
        @media (min-width: 768px) {
          .PageLayout .PageLayout-pane--sticky {
            top: var(--mgga-header-height, 72px);
            max-height: calc(100vh - var(--mgga-header-height, 72px));
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Clean up existing observer
    stickyHeaderState.observer?.disconnect();

    // Use ResizeObserver to handle layout settling and dynamic changes
    stickyHeaderState.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateHeaderHeight(entry.target);
      }
    });

    const observeHeader = () => {
      const header = document.querySelector(".PageLayout-header");
      debugLog("header:", header);
      if (header) {
        updateHeaderHeight(header);
        stickyHeaderState.observer.observe(header);
      } else {
        // Header not yet in DOM, try again
        requestAnimationFrame(observeHeader);
      }
    };
    observeHeader();
  } else {
    existingStyle?.remove();
    stickyHeaderState.observer?.disconnect();
    stickyHeaderState.observer = null;
    document.documentElement.style.removeProperty("--mgga-header-height");
  }
}

function makeGitHubAsTheUserDesires() {
  debugLog("makeGitHubAsTheUserDesires called");
  chrome.storage.sync.get(
    ["pluginEnabled", "stickyActionsHeader"],
    (result) => {
      debugLog("storage.sync.get result:", result);
      const isEnabled = result.pluginEnabled ?? true;
      if (isEnabled) {
        makeGithubGreatAgain({
          stickyActionsHeader: result.stickyActionsHeader ?? true,
        });
      } else {
        makeGithubBadAgain();
      }
    },
  );
}

function listenForStorageChanges() {
  chrome.storage.onChanged.addListener((changes, area) => {
    debugLog("Storage changed:", changes, area);
    const relevantChange =
      area === "sync" &&
      (changes.pluginEnabled || changes.stickyActionsHeader);
    if (relevantChange) {
      makeGitHubAsTheUserDesires();
    }
  });
}

flex();
makeGitHubAsTheUserDesires();
listenForStorageChanges();
