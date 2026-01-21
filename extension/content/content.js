(function() {
  let readabilityEnabled = false;

  // Initialize from storage
  browser.storage.sync.get('readabilityEnabled').then(result => {
    readabilityEnabled = result.readabilityEnabled || false;
    updateReadability();
  });

  // Listen for messages from popup
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleReadability') {
      readabilityEnabled = message.enabled;
      updateReadability();
    }
  });

  function updateReadability() {
    const root = document.documentElement;
    if (readabilityEnabled) {
      root.classList.add('nb-readability-enabled');
    } else {
      root.classList.remove('nb-readability-enabled');
    }
    applyProseClasses();
  }

  function applyProseClasses() {
    const docViewers = document.querySelectorAll('.labs-tailwind-doc-viewer');
    docViewers.forEach(viewer => {
      if (readabilityEnabled) {
        viewer.classList.add('prose', 'prose-slate', 'max-w-none');
      } else {
        viewer.classList.remove('prose', 'prose-slate', 'max-w-none');
      }
    });
  }

  // Observe DOM changes to handle dynamic content loading in NotebookLM
  const observer = new MutationObserver((mutations) => {
    if (readabilityEnabled) {
      applyProseClasses();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
