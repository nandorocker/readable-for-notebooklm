document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('readability-toggle');
  const settingItem = document.querySelector('.setting-item');

  function updateVisuals(enabled) {
    if (enabled) {
      settingItem.classList.remove('disabled');
    } else {
      settingItem.classList.add('disabled');
    }
  }

  // Load current state
  const result = await chrome.storage.sync.get('readabilityEnabled');
  const isEnabled = result.readabilityEnabled || false;
  toggle.checked = isEnabled;
  updateVisuals(isEnabled);

  // Listen for changes
  toggle.addEventListener('change', async () => {
    const enabled = toggle.checked;
    updateVisuals(enabled);
    await chrome.storage.sync.set({ readabilityEnabled: enabled });

    // Notify all NotebookLM tabs
    const tabs = await chrome.tabs.query({ url: "*://notebooklm.google.com/notebook/*" });
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'toggleReadability', 
        enabled: enabled 
      }).catch(() => {
        // Tab not ready, ignore
      });
    }
  });
});
