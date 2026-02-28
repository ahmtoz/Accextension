/* eslint-disable no-undef */
let styleElement = null;

function injectSVGFilters() {
  if (document.getElementById("accease-colorblind-filters")) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.id = "accease-colorblind-filters";
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    return true; // Keep the message channel open for async response
  } catch (error) {
    console.error("Error in content script:", error);
    sendResponse({ success: false, error: error.message });
    return true;
  }
});
