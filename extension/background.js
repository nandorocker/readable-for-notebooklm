// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('readabilityEnabled', (result) => {
    const enabled = result.readabilityEnabled || false;
    if (result.readabilityEnabled === undefined) {
      chrome.storage.sync.set({ readabilityEnabled: false });
    }
    updateIcon(enabled);
  });
});

// Update icon when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.readabilityEnabled) {
    updateIcon(changes.readabilityEnabled.newValue);
  }
});

function updateIcon(enabled) {
  const path = enabled ? {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png",
    "128": "icons/icon-128.png"
  } : {
    "48": "icons/icon-off-48.png",
    "96": "icons/icon-off-96.png",
    "128": "icons/icon-off-128.png"
  };

  chrome.action.setIcon({ path });
}
