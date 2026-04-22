// ============================================================================
// READEASE CONTENT SCRIPT - FIXED VERSION
// ============================================================================

const RULER_ID = 'readease-ruler-container';

function removeRuler() {
  const existing = document.getElementById(RULER_ID);
  if (existing) {
    if (existing._cleanup) existing._cleanup();
    existing.remove();
  }
}

function getRulerColor(colorKey) {
  const colors = {
    amber:  { ruler: 'rgba(251,191,36,0.18)',  overlay: 'rgb(251,191,36)' },
    sky:    { ruler: 'rgba(56,189,248,0.18)',  overlay: 'rgb(56,189,248)' },
    rose:   { ruler: 'rgba(251,113,133,0.18)', overlay: 'rgb(251,113,133)' },
    lime:   { ruler: 'rgba(163,230,53,0.18)',  overlay: 'rgb(163,230,53)' },
    violet: { ruler: 'rgba(167,139,250,0.18)', overlay: 'rgb(167,139,250)' },
    white:  { ruler: 'rgba(255,255,255,0.12)', overlay: 'rgb(255,255,255)' },
  };
  return colors[colorKey] || colors.amber;
}

function applyRuler(settings) {
  removeRuler();

  const {
    color = 'amber',
    rulerHeight = 80,
    blurAmount = 4,
    dimAmount = 0.5,
    effectType = 'both',
    rulerY = null,
  } = settings;

  const { ruler: rulerColor, overlay: overlayColor } = getRulerColor(color);
  const startY = rulerY !== null ? rulerY : Math.round(window.innerHeight / 2 - rulerHeight / 2);

  const host = document.createElement('div');
  host.id = RULER_ID;
  Object.assign(host.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '2147483647',
  });
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const blurPx   = effectType !== 'dim'  ? `${blurAmount}px` : '0px';
  const dimAlpha = effectType !== 'blur' ? dimAmount : 0;

  host.style.setProperty('--blur-px', blurPx);
  host.style.setProperty('--dim-alpha', dimAlpha);
  host.style.setProperty('--overlay-color', overlayColor);

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }

    .re-overlay-top,
    .re-overlay-bottom {
      position: fixed;
      left: 0;
      width: 100%;
      pointer-events: none;
      will-change: top, height;
      z-index:1;
    }

    /* 🔥 ANA LAYER: blur + dim */
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

    /* 🔥 RENK LAYER (ASIL FIX) */
    .re-overlay-top::after,
    .re-overlay-bottom::after {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--overlay-color);
      opacity: 0.25; /* burayı oynayabilirsin */
      pointer-events: none;
    }

    .re-ruler {
      position: fixed;
      left: 0;
      width: 100%;
      pointer-events: all;
      cursor: ns-resize;
      transition: height 0.15s ease, top 0.05s linear;
      border-top: 2px solid rgba(255,255,255,0.25);
      border-bottom: 2px solid rgba(255,255,255,0.25);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      isolate:isolate;
      filter: none !important!;
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

  const top    = document.createElement('div');
  top.className = 're-overlay-top';

  const ruler  = document.createElement('div');
  ruler.className = 're-ruler';

  const bottom = document.createElement('div');
  bottom.className = 're-overlay-bottom';

  shadow.appendChild(top);
  shadow.appendChild(ruler);
  shadow.appendChild(bottom);

  let currentY = startY;
  let currentH = rulerHeight;

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

  let dragging = false;
  let dragOffsetY = 0;

  ruler.addEventListener('mousedown', (e) => {
    dragging = true;
    dragOffsetY = e.clientY - currentY;
    e.preventDefault();
  });

  const onMouseMove = (e) => {
    if (!dragging) return;
    const newY = Math.max(0, Math.min(window.innerHeight - currentH, e.clientY - dragOffsetY));
    layout(newY, currentH);
  };

  const onMouseUp = () => {
    dragging = false;
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  host._cleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  host._update = (newSettings) => {
    const {
      color: nc = color,
      rulerHeight: nh = currentH,
      blurAmount: nb = blurAmount,
      dimAmount: nd = dimAmount,
      effectType: net = effectType,
    } = newSettings;

    const { ruler: rc, overlay: oc } = getRulerColor(nc);
    const bp = net !== 'dim' ? `${nb}px` : '0px';
    const da = net !== 'blur' ? nd : 0;

    host.style.setProperty('--blur-px', bp);
    host.style.setProperty('--dim-alpha', da);
    host.style.setProperty('--overlay-color', oc);

    layout(currentY, nh);
  };
}

function updateRuler(settings) {
  const host = document.getElementById(RULER_ID);
  if (host && host._update) {
    host._update(settings);
  } else {
    applyRuler(settings);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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