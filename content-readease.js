// ============================================================================
// READEASE CONTENT SCRIPT - Tamamen yeniden yazıldı
// ============================================================================

const RULER_ID = 'readease-ruler-container';

// ── HELPER: Remove existing ruler ──────────────────────────────────────────
function removeRuler() {
  const existing = document.getElementById(RULER_ID);
  if (existing) {
    if (existing._cleanup) existing._cleanup();
    existing.remove();
  }
}

// ── HELPER: Get color values ───────────────────────────────────────────────
function getRulerColor(colorKey) {
  const colors = {
    amber:  { ruler: 'rgba(251,191,36,0.18)',  overlay: 'rgba(0,0,0,0.45)' },
    sky:    { ruler: 'rgba(56,189,248,0.18)',  overlay: 'rgba(0,0,20,0.50)' },
    rose:   { ruler: 'rgba(251,113,133,0.18)', overlay: 'rgba(20,0,10,0.48)' },
    lime:   { ruler: 'rgba(163,230,53,0.18)',  overlay: 'rgba(0,10,0,0.46)' },
    violet: { ruler: 'rgba(167,139,250,0.18)', overlay: 'rgba(10,0,20,0.48)' },
    white:  { ruler: 'rgba(255,255,255,0.12)', overlay: 'rgba(0,0,0,0.50)' },
  };
  return colors[colorKey] || colors.amber;
}

// ── MAIN: Apply ruler to page ──────────────────────────────────────────────
function applyRuler(settings) {
  console.log('applyRuler called with:', settings);
  removeRuler();

  const {
    color = 'amber',
    rulerHeight = 80,
    blurAmount = 4,
    dimAmount = 0.5,
    effectType = 'both',
    rulerY = null,
  } = settings;

  const { ruler: rulerColor } = getRulerColor(color);
  const startY = rulerY !== null ? rulerY : Math.round(window.innerHeight / 2 - rulerHeight / 2);

  // Create host element
  const host = document.createElement('div');
  host.id = RULER_ID;
  Object.assign(host.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '2147483647',
  });
  document.documentElement.appendChild(host);

  // Create shadow DOM
  const shadow = host.attachShadow({ mode: 'open' });

  // Calculate effect values
  const blurPx   = effectType !== 'dim'  ? `${blurAmount}px` : '0px';
  const dimAlpha = effectType !== 'blur' ? dimAmount : 0;

  // Set CSS variables on host
  host.style.setProperty('--blur-px', blurPx);
  host.style.setProperty('--dim-alpha', dimAlpha);
  host.style.setProperty('--ruler-bg', rulerColor);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }

    .re-overlay-top,
    .re-overlay-bottom {
      position: fixed;
      left: 0;
      width: 100%;
      pointer-events: none;
      transition: top 0.05s linear, height 0.05s linear,
                  backdrop-filter 0.3s, background 0.3s;
      will-change: top, height;
    }

    .re-overlay-top {
      top: 0;
      background: rgba(0,0,0,var(--dim-alpha));
      backdrop-filter: blur(var(--blur-px));
      -webkit-backdrop-filter: blur(var(--blur-px));
    }

    .re-overlay-bottom {
      background: rgba(0,0,0,var(--dim-alpha));
      backdrop-filter: blur(var(--blur-px));
      -webkit-backdrop-filter: blur(var(--blur-px));
    }

    .re-ruler {
      position: fixed;
      left: 0;
      width: 100%;
      pointer-events: all;
      cursor: ns-resize;
      transition: height 0.15s ease, top 0.05s linear;
      will-change: top, height;
      background: var(--ruler-bg);
      border-top: 2px solid rgba(255,255,255,0.25);
      border-bottom: 2px solid rgba(255,255,255,0.25);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .re-ruler::after {
      content: '⠿⠿⠿';
      font-size: 14px;
      color: rgba(255,255,255,0.35);
      letter-spacing: 4px;
      pointer-events: none;
      user-select: none;
    }
  `;
  shadow.appendChild(style);

  // Create elements
  const top    = document.createElement('div'); 
  top.className = 're-overlay-top';
  
  const ruler  = document.createElement('div'); 
  ruler.className = 're-ruler';
  
  const bottom = document.createElement('div'); 
  bottom.className = 're-overlay-bottom';
  
  shadow.appendChild(top);
  shadow.appendChild(ruler);
  shadow.appendChild(bottom);

  // State
  let currentY = startY;
  let currentH = rulerHeight;

  // Layout function
  function layout(y, h) {
    currentY = y;
    currentH = h;
    top.style.height    = `${y}px`;
    ruler.style.top     = `${y}px`;
    ruler.style.height  = `${h}px`;
    bottom.style.top    = `${y + h}px`;
    bottom.style.height = `${window.innerHeight - y - h}px`;
  }

  layout(startY, rulerHeight);

  // Dragging logic
  let dragging = false;
  let dragOffsetY = 0;

  ruler.addEventListener('mousedown', (e) => {
    dragging = true;
    dragOffsetY = e.clientY - currentY;
    ruler.style.cursor = 'grabbing';
    e.preventDefault();
  });

  const onMouseMove = (e) => {
    if (!dragging) return;
    const newY = Math.max(0, Math.min(window.innerHeight - currentH, e.clientY - dragOffsetY));
    layout(newY, currentH);
  };
  
  const onMouseUp = () => {
    if (dragging) {
      dragging = false;
      ruler.style.cursor = 'ns-resize';
    }
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Cleanup function
  host._cleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

// Update function for live changes
host._update = (newSettings) => {
  const {
    color: nc = color,
    rulerHeight: nh = currentH,
    blurAmount: nb = blurAmount,
    dimAmount: nd = dimAmount,
    effectType: net = effectType,
  } = newSettings;

  const { ruler: rc } = getRulerColor(nc);
  const bp  = net !== 'dim'  ? `${nb}px` : '0px';
  const da  = net !== 'blur' ? nd : 0;

  host.style.setProperty('--blur-px', bp);
  host.style.setProperty('--dim-alpha', da);
  host.style.setProperty('--ruler-bg', rc);

  // Ruler'ın background'unu doğrudan güncelle
  ruler.style.background = rc;

  layout(currentY, nh);
};
}

// ── UPDATE: Update existing ruler ──────────────────────────────────────────
function updateRuler(settings) {
  console.log('updateRuler called with:', settings);
  const host = document.getElementById(RULER_ID);
  if (host && host._update) {
    host._update(settings);
  } else {
    applyRuler(settings);
  }
}

// ── MESSAGE LISTENER ───────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message.action);
  
  if (message.action === 'ping') {
    sendResponse({ alive: true });
    return true;
  }
  
  if (message.action === 'applyRuler') {
    applyRuler(message.settings);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'removeRuler') {
    removeRuler();
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'updateRuler') {
    updateRuler(message.settings);
    sendResponse({ success: true });
    return true;
  }
});

console.log('✅ ReadEase content script loaded successfully');