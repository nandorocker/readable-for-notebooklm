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
      console.log('[NotebookLM Readability] Extension enabled');
    } else {
      root.classList.remove('nb-readability-enabled');
      console.log('[NotebookLM Readability] Extension disabled');
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
    // Only target doc viewers that are inside note-editor (not chat)
    const noteEditors = document.querySelectorAll('note-editor');
    console.log('[NotebookLM Readability] Found', noteEditors.length, 'note-editor elements');
    
    noteEditors.forEach(editor => {
      const docViewer = editor.querySelector('labs-tailwind-doc-viewer');
      console.log('[NotebookLM Readability] Found docViewer:', !!docViewer);
      if (!docViewer) return;

      if (readabilityEnabled) {
        docViewer.classList.add('nb-note-viewer');
        console.log('[NotebookLM Readability] Added nb-note-viewer class');
        injectTitleIntoContent(docViewer);
      } else {
        docViewer.classList.remove('nb-note-viewer');
        console.log('[NotebookLM Readability] Removed nb-note-viewer class');
        removeInjectedTitle(docViewer);
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
        
        // Keep the original title visible and editable
      }
    }
  }

  function removeInjectedTitle(viewer) {
    const injected = viewer.querySelector('.nb-injected-title');
    if (injected) injected.remove();
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
