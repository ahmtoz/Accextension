const KEYNAV_STYLE_ID = 'accextension-keynav-styles';

function removeKeyNav() {
  const existing = document.getElementById(KEYNAV_STYLE_ID);
  if (existing) {
    existing.remove();
  }
}

function applyKeyNav() {
  console.log('applyKeyNav called');
  removeKeyNav();

  const style = document.createElement('style');
  style.id = KEYNAV_STYLE_ID;
  style.textContent = `
    *:focus-visible {
      outline: 3px solid #000000 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.3) !important;
      transition: outline-offset 0.1s ease-in-out !important;
    }

    /* Input fields and Textareas */
    input:not([type="radio"]):not([type="checkbox"]):focus-visible, 
    textarea:focus-visible {
      outline: 3px solid #0f172a !important;
      outline-offset: 1px !important;
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.3) !important;
      border-color: #0f172a !important;
    }

    /* Select Dropdowns */
    select:focus-visible {
      outline: 3px dashed #000000 !important;
      outline-offset: 2px !important;
      box-shadow: none !important;
    }

    /* Checkboxes and Radio buttons */
    input[type="checkbox"]:focus-visible,
    input[type="radio"]:focus-visible {
      outline: 3px solid #1e3a8a !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 5px rgba(30, 58, 138, 0.3) !important;
    }
  `;

  document.head.appendChild(style);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('KeyNav message received:', message.action);

  if (message.action === 'pingKeyNav') {
    sendResponse({ alive: true });
    return true;
  }

  if (message.action === 'applyKeyNav') {
    applyKeyNav();
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'removeKeyNav') {
    removeKeyNav();
    sendResponse({ success: true });
    return true;
  }
});

console.log('KeyNav content script loaded successfully');
