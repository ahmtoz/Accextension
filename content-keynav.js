const KEYNAV_STYLE_ID = 'accextension-keynav-styles';
const KEYNAV_SKIP_ID = 'accextension-keynav-skip-link';
const KEYNAV_SKIP_STYLE_ID = 'accextension-keynav-skip-styles';

function removeKeyNav() {
  const styleEl = document.getElementById(KEYNAV_STYLE_ID);
  if (styleEl) styleEl.remove();

  const skipStyleEl = document.getElementById(KEYNAV_SKIP_STYLE_ID);
  if (skipStyleEl) skipStyleEl.remove();

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

  const skipToMainContent = document.createElement("nav");
  skipToMainContent.innerHTML = `
  <div class="skip-to-main-content" aria-label="Skip to main content">
    <div class="skip-to-main-content-header">
      <h2>Skip to</h2>
      <a href="#${targetId}">Main Content</a>
    </div>
    <div class="skip-to-main-content-body">
      <h2>Keyboard Shortcuts</h2>
      <ul>
        <li>
          <a href="#">
            <div>
              <span>Search</span>
              <div>
                <span class="keynav-key">Command</span>
                <span>+</span>
                <span class="keynav-key">K</span>
              </div>
            </div>
          </a>
        </li>
        <li>
          <a href="#">
            <div>
              <span>Open Modal</span>
              <div>
                <span class="keynav-key">Shift</span>
                <span>+</span>
                <span class="keynav-key">Alt</span>
                <span>+</span>
                <span class="keynav-key">Z</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
  `
  skipToMainContent.id = KEYNAV_SKIP_ID;

  const skipStyle = document.createElement('style');
  skipStyle.id = KEYNAV_SKIP_STYLE_ID;
  skipStyle.textContent = `
    #${KEYNAV_SKIP_ID} {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transform: translateY(-200%);
      background-color: rgba(255, 255, 255);
      color: #333;
      padding: 16px 24px;
      font-size: 20px;
      border: 2px solid white;
      border-radius: 0 0 12px 0;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #${KEYNAV_SKIP_ID}:focus-within .skip-to-main-content, #${KEYNAV_SKIP_ID} .skip-to-main-content.active {
      transform: translateY(0);
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a {
      font-size: 12px;
      font-weight: bold;
      color: #2563eb;
      text-decoration: none;
      padding: 4px 8px;
      border-radius: 6px;
      border: 2px solid transparent;
      outline: none;
      transition: all 0.15s ease;
    }
    
    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a:hover {
      background-color: rgba(37, 99, 235, 0.1);
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a:focus-visible {
      border-color: #2563eb;
      background-color: rgba(37, 99, 235, 0.1);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-top: 1px solid #d1d5db;
      padding-top: 16px;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body ul {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body li {
      display: flex;
      flex-direction: column;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body li div:first-child {
      display: flex;
      justify-content: space-between;
      gap: 32px;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body li span {
      font-size: 14px;
      font-weight: 500;
      color: #000;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body li div div {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body span.keynav-key {
      font-size: 12px;
      font-weight: 700;
      background-color: #ffffff;
      border: 1px solid #d1d5db;
      border-bottom: 2px solid #9ca3af;
      border-radius: 6px;
      padding: 4px 8px;
      color: #111;
      text-transform: capitalize;
    }
  `;

  document.head.appendChild(skipStyle);

  skipToMainContent.addEventListener('click', (e) => {
    setTimeout(() => {
      targetElement.focus({ preventScroll: true });
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  });

  skipToMainContent.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const links = Array.from(skipToMainContent.querySelectorAll('a'));
      const activeIndex = links.indexOf(document.activeElement);

      if (activeIndex !== -1) {
        e.preventDefault();
        let nextIndex;

        if (e.key === 'ArrowDown') {
          nextIndex = (activeIndex + 1) % links.length;
        } else {
          nextIndex = (activeIndex - 1 + links.length) % links.length;
        }

        links[nextIndex].focus();
      }
    }
  });

  document.body.prepend(skipToMainContent);

  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'z') {
      const skipMenu = document.getElementById(KEYNAV_SKIP_ID);
      if (!skipMenu) return;
      e.preventDefault();

      if (skipMenu.contains(document.activeElement)) {
        document.activeElement.blur();
      } else {
        const firstLink = skipMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }
  });
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
    removeKeyNav();

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
