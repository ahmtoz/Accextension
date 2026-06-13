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

  function findSearchElement() {
    const allInputs = Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"], [role="searchbox"]'));
    const searchKeywords = /search|query|find|ara|bul|buscar|suche|sök/i;
    const candidates = [];

    for (const el of allInputs) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 &&
        window.getComputedStyle(el).display !== 'none' &&
        window.getComputedStyle(el).visibility !== 'hidden' &&
        el.style.opacity !== '0';

      if (!isVisible) continue;
      if (el.disabled || el.readOnly || el.hasAttribute('disabled') || el.hasAttribute('readonly')) continue;

      const tagName = el.tagName.toLowerCase();

      if (tagName === 'input') {
        const type = (el.getAttribute('type') || 'text').toLowerCase();
        const excludedTypes = ['password', 'checkbox', 'radio', 'file', 'submit', 'button', 'reset', 'image', 'range', 'color', 'date', 'datetime-local', 'month', 'time', 'week', 'email', 'number', 'tel'];
        if (excludedTypes.includes(type)) continue;
      }

      let score = 0;

      const typeAttr = (el.getAttribute('type') || '').toLowerCase();
      const roleAttr = (el.getAttribute('role') || '').toLowerCase();
      const idAttr = (el.id || '').toLowerCase();
      const nameAttr = (el.getAttribute('name') || '').toLowerCase();
      const placeholderAttr = (el.getAttribute('placeholder') || '').toLowerCase();
      const ariaLabelAttr = (el.getAttribute('aria-label') || '').toLowerCase();
      const titleAttr = (el.getAttribute('title') || '').toLowerCase();
      const classNameAttr = (el.getAttribute('class') || '').toLowerCase();

      if (typeAttr === 'search' || roleAttr === 'searchbox') {
        score += 100;
      }

      if (nameAttr === 'q' || nameAttr === 'query' || nameAttr === 'search' || nameAttr === 's') {
        score += 85;
      }
      if (idAttr === 'search' || idAttr === 'search-input' || idAttr === 'search_input' || idAttr === 'searchbox') {
        score += 85;
      }

      if (nameAttr && searchKeywords.test(nameAttr)) {
        score += 55;
      }
      if (idAttr && searchKeywords.test(idAttr)) {
        score += 55;
      }

      if (placeholderAttr && searchKeywords.test(placeholderAttr)) {
        score += 75;
      }
      if (ariaLabelAttr && searchKeywords.test(ariaLabelAttr)) {
        score += 75;
      }
      if (titleAttr && searchKeywords.test(titleAttr)) {
        score += 70;
      }

      if (classNameAttr && searchKeywords.test(classNameAttr)) {
        score += 45;
      }

      let labelText = '';
      if (idAttr) {
        const labels = document.querySelectorAll(`label[for="${el.id}"]`);
        labels.forEach(lbl => {
          labelText += ' ' + lbl.textContent;
        });
      }
      let parent = el.parentElement;
      while (parent) {
        if (parent.tagName.toLowerCase() === 'label') {
          labelText += ' ' + parent.textContent;
          break;
        }
        parent = parent.parentElement;
      }

      const ariaLabelledby = el.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        const referencedEl = document.getElementById(ariaLabelledby);
        if (referencedEl) {
          labelText += ' ' + referencedEl.textContent;
        }
      }

      if (labelText && searchKeywords.test(labelText)) {
        score += 65;
      }

      let container = el.parentElement;
      let depth = 0;
      while (container && depth < 5) {
        const containerRole = (container.getAttribute('role') || '').toLowerCase();
        const containerId = (container.id || '').toLowerCase();
        const containerClass = (container.getAttribute('class') || '').toLowerCase();
        const containerTag = container.tagName.toLowerCase();

        if (containerRole === 'search' || containerTag === 'search') {
          score += 50;
          break;
        }
        if (searchKeywords.test(containerId) || searchKeywords.test(containerClass)) {
          score += 35;
          break;
        }
        container = container.parentElement;
        depth++;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const absoluteTop = rect.top + scrollTop;

      if (absoluteTop < 350) {
        score += 20;
      } else if (absoluteTop < 800) {
        score += 5;
      }

      if (rect.width > 200) {
        score += 10;
      }

      if (typeAttr === 'text' || tagName === 'textarea' || el.hasAttribute('contenteditable')) {
        score += 10;
      }

      candidates.push({ element: el, score: score });
    }

    candidates.sort((a, b) => b.score - a.score);

    console.log('Search field candidates and scores:', candidates.map(c => ({
      tagName: c.element.tagName,
      id: c.element.id,
      name: c.element.getAttribute('name'),
      score: c.score
    })));

    if (candidates.length > 0 && candidates[0].score >= 30) {
      return candidates[0].element;
    }

    if (candidates.length > 0) {
      return candidates[0].element;
    }

    return document.body;
  }

  const searchElement = findSearchElement();
  const hasSearch = searchElement && searchElement !== document.body;
  let searchId = '';

  if (hasSearch) {
    searchId = searchElement.id;
    if (!searchId) {
      searchId = 'accextension-search-target';
      searchElement.id = searchId;
    }

    if (!searchElement.hasAttribute('tabindex')) {
      searchElement.setAttribute('tabindex', '-1');
      searchElement.style.outline = 'none';
    }
  }

  const isMac = navigator.userAgent.toLowerCase().includes('mac');
  const modifierLabel = isMac ? 'Option' : 'Alt';

  const searchShortcutHTML = hasSearch ? `
        <li>
          <a href="#${searchId}" tabindex="0">
            <div>
              <span>Search</span>
              <div>
                <span class="keynav-key">${modifierLabel}</span>
                <span>+</span>
                <span class="keynav-key">K</span>
              </div>
            </div>
          </a>
        </li>
  ` : '';

  const skipToMainContent = document.createElement("nav");
  skipToMainContent.innerHTML = `
  <div class="skip-to-main-content" aria-label="Skip to main content">
    <div class="skip-to-main-content-header">
      <h2>Skip to</h2>
      <a href="#${targetId}" tabindex="0">Main Content</a>
    </div>
    <div class="skip-to-main-content-body">
      <h2>Keyboard Shortcuts</h2>
      <ul>
        ${searchShortcutHTML}
        <li>
          <a href="#" tabindex="0">
            <div>
              <span>Open Modal</span>
              <div>
                <span class="keynav-key">Shift</span>
                <span>+</span>
                <span class="keynav-key">${modifierLabel}</span>
                <span>+</span>
                <span class="keynav-key">Z</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
  `;
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

    #${KEYNAV_SKIP_ID} a {
      text-decoration: none !important;
      pointer-events: auto !important;
      cursor: pointer !important;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a {
      font-size: 12px;
      font-weight: bold;
      color: #2563eb !important;
      padding: 4px 8px;
      border-radius: 6px;
      border: 2px solid transparent;
      transition: all 0.15s ease;
    }
    
    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a:hover {
      background-color: rgba(37, 99, 235, 0.1) !important;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-header a:focus-visible {
      border-color: #2563eb !important;
      background-color: rgba(37, 99, 235, 0.1) !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body a {
      color: inherit !important;
      display: block !important;
      padding: 8px 12px !important;
      border-radius: 6px !important;
      border: 2px solid transparent !important;
      transition: all 0.15s ease !important;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body a:hover {
      background-color: rgba(37, 99, 235, 0.05) !important;
    }

    #${KEYNAV_SKIP_ID} .skip-to-main-content-body a:focus-visible {
      border-color: #2563eb !important;
      background-color: rgba(37, 99, 235, 0.1) !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
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
      align-items: center;
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
    const mainContentLink = e.target.closest(`a[href="#${targetId}"]`);
    const searchLink = hasSearch ? e.target.closest(`a[href="#${searchId}"]`) : null;

    if (mainContentLink) {
      e.preventDefault();
      setTimeout(() => {
        targetElement.focus({ preventScroll: true });
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 10);
    } else if (searchLink) {
      e.preventDefault();
      setTimeout(() => {
        searchElement.focus();
      }, 10);
    }
  });

  skipToMainContent.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const links = Array.from(skipToMainContent.querySelectorAll('a'));
      const activeIndex = links.indexOf(document.activeElement);

      if (links.length > 0) {
        if (activeIndex !== -1) {
          let nextIndex;

          if (e.key === 'ArrowDown') {
            nextIndex = (activeIndex + 1) % links.length;
          } else {
            nextIndex = (activeIndex - 1 + links.length) % links.length;
          }

          links[nextIndex].focus();
        } else {
          links[0].focus();
        }
      }
    }
  }, true);

  document.body.prepend(skipToMainContent);

  document.addEventListener('keydown', (e) => {
    const isZ = e.key.toLowerCase() === 'z' || e.code === 'KeyZ';
    if (e.shiftKey && e.altKey && !e.ctrlKey && !e.metaKey && isZ) {
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

  document.addEventListener('keydown', (e) => {
    const isK = e.key.toLowerCase() === 'k' || e.code === 'KeyK';
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && isK) {
      if (!hasSearch || !searchElement) return;
      e.preventDefault();

      searchElement.focus();
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

function applyFeatures(features) {
  removeKeyNav();
  if (features) {
    if (features.focus) {
      applyKeyNavFocus();
    }
    if (features.skipToMainContent) {
      applyKeyNavSkipToMainContent();
    }
  }
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(['keyNavFeatures'], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error reading from chrome.storage:", chrome.runtime.lastError);
      return;
    }
    if (result && result.keyNavFeatures) {
      console.log('Applying stored KeyNav features:', result.keyNavFeatures);
      applyFeatures(result.keyNavFeatures);
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.keyNavFeatures) {
      const newFeatures = changes.keyNavFeatures.newValue;
      console.log('KeyNav features updated via storage:', newFeatures);
      applyFeatures(newFeatures);
    }
  });
}

console.log('KeyNav content script loaded successfully');
