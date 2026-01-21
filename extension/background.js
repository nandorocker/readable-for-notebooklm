// Initialize storage on installation
browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get('readabilityEnabled').then(result => {
    const enabled = result.readabilityEnabled || false;
    if (result.readabilityEnabled === undefined) {
      browser.storage.sync.set({ readabilityEnabled: false });
    }
    updateIcon(enabled);
  });
});

// Update icon when storage changes
browser.storage.onChanged.addListener((changes) => {
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

  browser.action.setIcon({ path });
}
