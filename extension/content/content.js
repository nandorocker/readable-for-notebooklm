(function() {
  let readabilityEnabled = false;
  let focusMode = false;
  let originalParent = null;
  let focusModal = null;

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
        injectFocusButton();
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

  function injectFocusButton() {
    // Check if button already exists
    if (document.querySelector('.nb-focus-button')) return;

    // Find the note title container with the delete button
    const titleContainer = document.querySelector('.note-title-container');
    if (!titleContainer) return;

    // Find the delete button
    const deleteButton = titleContainer.querySelector('button[aria-label*="Delete"]');
    if (!deleteButton) return;

    // Create the fullscreen button matching NotebookLM's Material Design style
    const button = document.createElement('button');
    button.className = 'nb-focus-button mdc-icon-button mat-mdc-icon-button mat-mdc-button-base';
    button.setAttribute('aria-label', 'Focused reading mode');
    button.setAttribute('mat-icon-button', '');
    button.innerHTML = `
      <span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>
      <span class="material-symbols-outlined google-symbols">expand_content</span>
      <span class="mat-focus-indicator"></span>
      <span class="mat-mdc-button-touch-target"></span>
    `;
    
    // Insert before the delete button
    titleContainer.insertBefore(button, deleteButton);

    // Add click handler
    button.addEventListener('click', openFocusMode);
  }

  function openFocusMode() {
    if (focusMode) return;

    const noteEditor = document.querySelector('note-editor');
    const docViewer = noteEditor?.querySelector('.nb-note-viewer');
    if (!docViewer) return;

    // Store original parent
    originalParent = docViewer.parentElement;

    // Create modal overlay
    focusModal = document.createElement('div');
    focusModal.className = 'nb-focus-modal nb-readability-enabled';
    focusModal.innerHTML = `
      <div class="nb-focus-modal-backdrop"></div>
      <div class="nb-focus-modal-panel">
        <div class="nb-focus-modal-header">
          <button class="nb-focus-close" aria-label="Exit focused reading mode">
            <span class="material-symbols-outlined google-symbols">collapse_content</span>
          </button>
        </div>
        <div class="nb-focus-modal-content"></div>
      </div>
    `;

    // Move the doc viewer into the modal
    const contentContainer = focusModal.querySelector('.nb-focus-modal-content');
    contentContainer.appendChild(docViewer);

    // Add to DOM
    document.body.appendChild(focusModal);

    // Set up event listeners
    const closeButton = focusModal.querySelector('.nb-focus-close');
    const backdrop = focusModal.querySelector('.nb-focus-modal-backdrop');
    
    closeButton.addEventListener('click', closeFocusMode);
    backdrop.addEventListener('click', closeFocusMode);

    focusMode = true;
  }

  function closeFocusMode() {
    if (!focusMode || !focusModal || !originalParent) return;

    const docViewer = focusModal.querySelector('.nb-note-viewer');
    if (docViewer && originalParent) {
      // Move the doc viewer back to original location
      originalParent.appendChild(docViewer);
    }

    // Remove modal from DOM
    focusModal.remove();
    focusModal = null;
    originalParent = null;
    focusMode = false;
  }

  // Handle ESC key to close focus mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusMode) {
      closeFocusMode();
    }
  });

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
