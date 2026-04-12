const KEYNAV_STYLE_ID = 'accextension-keynav-styles';
const KEYNAV_SKIP_ID = 'accextension-keynav-skip-link';

function removeKeyNav() {
  const styleEl = document.getElementById(KEYNAV_STYLE_ID);
  if (styleEl) styleEl.remove();

  const skipEl = document.getElementById(KEYNAV_SKIP_ID);
  if (skipEl) skipEl.remove();
}

function applyKeyNavFocus() {
  console.log('applyKeyNavFocus called');

  const style = document.createElement('style');
  style.id = KEYNAV_STYLE_ID;
  style.textContent = `
    *:focus-visible {
      outline: 3px solid #000000 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.3) !important;
      transition: outline-offset 0.1s ease-in-out !important;
    }

    input:not([type="radio"]):not([type="checkbox"]):focus-visible, 
    textarea:focus-visible {
      outline: 3px solid #0f172a !important;
      outline-offset: 1px !important;
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.3) !important;
      border-color: #0f172a !important;
    }

    select:focus-visible {
      outline: 3px dashed #000000 !important;
      outline-offset: 2px !important;
      box-shadow: none !important;
    }

    input[type="checkbox"]:focus-visible,
    input[type="radio"]:focus-visible {
      outline: 3px solid #1e3a8a !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 5px rgba(30, 58, 138, 0.3) !important;
    }
  `;

  document.head.appendChild(style);
}

function applyKeyNavSkipToMainContent() {
  console.log('applyKeyNavSkipToMainContent called');

  function findMainContentElement() {
    const main = document.querySelector('main');
    if (main && main.offsetHeight > 0) return main;

    const roleMain = document.querySelector('[role="main"]');
    if (roleMain && roleMain.offsetHeight > 0) return roleMain;

    const idMain = document.querySelector('#main-content, #main, #content');
    if (idMain && idMain.offsetHeight > 0) return idMain;

    const section = document.querySelector('section');
    if (section && section.offsetHeight > 0) return section;

    const navs = document.querySelectorAll('nav');
    for (const nav of navs) {
      let nextEl = nav.nextElementSibling;
      while (nextEl) {
        if (nextEl.tagName.toLowerCase() === 'div' && nextEl.offsetHeight > 0) {
          return nextEl;
        }
        nextEl = nextEl.nextElementSibling;
      }
    }

    return document.body;
  }

  const targetElement = findMainContentElement();
  let targetId = targetElement.id;

  if (!targetId) {
    targetId = 'accextension-main-target';
    targetElement.id = targetId;
  }

  if (!targetElement.hasAttribute('tabindex')) {
    targetElement.setAttribute('tabindex', '-1');
    targetElement.style.outline = 'none';
  }

  const skipToMainContent = document.createElement("a");
  skipToMainContent.id = KEYNAV_SKIP_ID;
  skipToMainContent.href = `#${targetId}`;
  skipToMainContent.textContent = "Skip to Main Content";
  skipToMainContent.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-200%);
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 24px;
    font-size: 20px;
    font-weight: bold;
    z-index: 9999;
    text-decoration: none;
    border: 2px solid white;
    border-radius: 0 0 8px 0;
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease-in-out;
  `;

  skipToMainContent.addEventListener('focus', () => {
    skipToMainContent.style.transform = 'translateY(0)';
  });

  skipToMainContent.addEventListener('blur', () => {
    skipToMainContent.style.transform = 'translateY(-200%)';
  });

  skipToMainContent.addEventListener('click', (e) => {
    setTimeout(() => {
      targetElement.focus({ preventScroll: true });
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  });

  document.body.prepend(skipToMainContent);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('KeyNav message received:', message.action);

  if (message.action === 'pingKeyNav') {
    sendResponse({
      alive: true,
      activeFeatures: {
        focus: !!document.getElementById(KEYNAV_STYLE_ID),
        skipToMainContent: !!document.getElementById(KEYNAV_SKIP_ID)
      }
    });
    return true;
  }

  if (message.action === 'applyKeyNav') {
    removeKeyNav(); // Clear before applying new features

    if (message.types && message.types.includes('focus')) {
      applyKeyNavFocus();
    }
    if (message.types && message.types.includes('skipToMainContent')) {
      applyKeyNavSkipToMainContent();
    }

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
