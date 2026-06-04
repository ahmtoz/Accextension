/* eslint-disable no-undef */
let styleElement = null;

function injectSVGFilters() {
  if (document.getElementById("accextension-colorsense-filters")) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.id = "accextension-colorsense-filters";
  svg.setAttribute("style", "display: none; height: 0; width: 0; position: absolute;");

  // Protanopia matrix based on Daltonization principles (approximate for demonstration)
  // Converting RGB to LMS, adjusting for missing Red cones, and converting back
  svg.innerHTML = `
    <defs>
      <filter id="accextension-protanopia" color-interpolation-filters="linearRGB">
        <feColorMatrix type="matrix" values="
          0.567  0.433  0.000  0.000  0
          0.558  0.442  0.000  0.000  0
          0.000  0.242  0.758  0.000  0
          0      0      0      1      0
        "/>
      </filter>
      <!-- Deuteranopia matrix -->
      <filter id="accextension-deuteranopia" color-interpolation-filters="linearRGB">
        <feColorMatrix type="matrix" values="
          0.625  0.375  0.000  0.000  0
          0.700  0.300  0.000  0.000  0
          0.000  0.300  0.700  0.000  0
          0      0      0      1      0
        "/>
      </filter>
      <!-- Tritanopia matrix -->
      <filter id="accextension-tritanopia" color-interpolation-filters="linearRGB">
        <feColorMatrix type="matrix" values="
          0.950  0.050  0.000  0.000  0
          0.000  0.433  0.567  0.000  0
          0.000  0.475  0.525  0.000  0
          0      0      0      1      0
        "/>
      </filter>
      <!-- Achromatopsia matrix -->
      <filter id="accextension-achromatopsia" color-interpolation-filters="linearRGB">
        <feColorMatrix type="matrix" values="
          0.299  0.587  0.114  0.000  0
          0.299  0.587  0.114  0.000  0
          0.299  0.587  0.114  0.000  0
          0      0      0      1      0
        "/>
      </filter>
    </defs>
  `;

  document.body.appendChild(svg);
}

function injectCSS(colorBlindType) {
  // Remove existing styles first
  removeCSS();

  // Inject SVG definitions if not present
  injectSVGFilters();

  // Create new style element
  styleElement = document.createElement("link");
  styleElement.rel = "stylesheet";
  styleElement.type = "text/css";

  const cssUrl = chrome.runtime.getURL(`styles/${colorBlindType}.css`);
  console.log('Injecting CSS from:', cssUrl);
  styleElement.href = cssUrl;
  styleElement.id = "accease-colorblind-css";

  // Add error handler
  styleElement.onerror = () => {
    console.error(`Failed to load CSS file: ${cssUrl}`);
    styleElement = null;
  };

  styleElement.onload = () => {
    console.log(`Successfully loaded CSS: ${cssUrl}`);
  };

  document.head.appendChild(styleElement);
}

function removeCSS() {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }

  // Also remove by ID in case element reference is lost
  const existingStyle = document.getElementById("accease-colorblind-css");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Remove the SVG filters container if it exists
  const existingSvg = document.getElementById("accease-colorblind-filters");
  if (existingSvg) {
    existingSvg.remove();
  }
}

// Listen for messages from popup
// src/pages/extensions/colorsense/content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // SADECE ColorSense mesajlarını filtrele
  if (["ping", "applyColorBlind", "removeColorBlind"].includes(message.action)) {
    try {
      if (message.action === "ping") {
        sendResponse({ success: true });
      } else if (message.action === "applyColorBlind") {
        if (message.type) {
          injectCSS(message.type);
          sendResponse({ success: true, type: message.type });
        } else {
          sendResponse({ success: false, error: "No color type specified" });
        }
      } else if (message.action === "removeColorBlind") {
        removeCSS();
        sendResponse({ success: true });
      }
    } catch (error) {
      console.error("Error in ColorSense:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Sadece bu mesajları işlediysek true dön
  }
});

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(['colorBlindType'], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error reading from chrome.storage:", chrome.runtime.lastError);
      return;
    }
    if (result && result.colorBlindType) {
      console.log('Applying stored ColorSense filter:', result.colorBlindType);
      injectCSS(result.colorBlindType);
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.colorBlindType) {
      const newType = changes.colorBlindType.newValue;
      if (newType) {
        console.log('ColorSense filter updated via storage:', newType);
        injectCSS(newType);
      } else {
        console.log('ColorSense filter removed via storage');
        removeCSS();
      }
    }
  });
}
