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
      outline: 3px solid #ff9800 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.4) !important;
      transition: outline-offset 0.1s ease-in-out !important;
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
