// Initialize storage on installation
browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get('readabilityEnabled').then(result => {
    if (result.readabilityEnabled === undefined) {
      browser.storage.sync.set({ readabilityEnabled: false });
    }
  });
});
