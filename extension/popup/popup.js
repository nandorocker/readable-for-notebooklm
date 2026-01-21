document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('readability-toggle');

  // Load current state
  const result = await browser.storage.sync.get('readabilityEnabled');
  toggle.checked = result.readabilityEnabled || false;

  // Listen for changes
  toggle.addEventListener('change', async () => {
    const enabled = toggle.checked;
    await browser.storage.sync.set({ readabilityEnabled: enabled });

    // Notify all NotebookLM tabs
    const tabs = await browser.tabs.query({ url: "*://notebooklm.google.com/*" });
    for (const tab of tabs) {
      browser.tabs.sendMessage(tab.id, { 
        action: 'toggleReadability', 
        enabled: enabled 
      }).catch(err => console.log('Tab not ready:', err));
    }
  });
});
