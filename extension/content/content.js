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
      hideViewOnlyMessage();
    } else {
      root.classList.remove('nb-readability-enabled');
    }
    applyProseClasses();
  }

  function hideViewOnlyMessage() {
    if (!readabilityEnabled) return;

    // Look for the "Saved responses are view only" text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('(Saved responses are view only)')) {
        const parent = node.parentElement;
        if (parent) {
          parent.style.display = 'none';
          // Also try to hide the immediate container if it's just a wrapper
          if (parent.parentElement && parent.parentElement.children.length === 1) {
            parent.parentElement.style.display = 'none';
          }
        }
      }
    }
  }

  function applyProseClasses() {
    const docViewers = document.querySelectorAll('.labs-tailwind-doc-viewer');
    docViewers.forEach(viewer => {
      if (readabilityEnabled) {
        viewer.classList.add('prose', 'prose-slate', 'max-w-none');
        injectTitleIntoContent(viewer);
      } else {
        viewer.classList.remove('prose', 'prose-slate', 'max-w-none');
        removeInjectedTitle(viewer);
      }
    });
  }

  function injectTitleIntoContent(viewer) {
    // Check if we already injected it
    if (viewer.querySelector('.nb-injected-title')) return;

    // Find the original title
    const originalTitle = document.querySelector('.note-header__editable-title');
    if (originalTitle) {
      const titleValue = originalTitle.value || originalTitle.textContent;
      if (titleValue) {
        const h1 = document.createElement('h1');
        h1.className = 'nb-injected-title';
        h1.textContent = titleValue;
        viewer.prepend(h1);
        
        // Hide the original one to prevent duplication and clipping issues
        originalTitle.classList.add('nb-hidden-title');
      }
    }
  }

  function removeInjectedTitle(viewer) {
    const injected = viewer.querySelector('.nb-injected-title');
    if (injected) injected.remove();

    const originalTitle = document.querySelector('.note-header__editable-title');
    if (originalTitle) {
      originalTitle.classList.remove('nb-hidden-title');
    }
  }

  // Observe DOM changes to handle dynamic content loading in NotebookLM
  const observer = new MutationObserver((mutations) => {
    if (readabilityEnabled) {
      applyProseClasses();
      hideViewOnlyMessage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
