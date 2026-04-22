import { useState, useCallback } from 'react';
import './readease.css';

const COLORS = [
  { key: 'amber',  label: 'Amber',  hex: '#FBB724' },
  { key: 'sky',    label: 'Sky',    hex: '#38BDF8' },
  { key: 'rose',   label: 'Rose',   hex: '#FB7185' },
  { key: 'lime',   label: 'Lime',   hex: '#A3E635' },
  { key: 'violet', label: 'Violet', hex: '#A78BFA' },
  { key: 'white',  label: 'White',  hex: '#FFFFFF' },
];

const EFFECT_OPTIONS = [
  { key: 'blur', label: 'Blur only' },
  { key: 'dim',  label: 'Dım only'  },
  { key: 'both', label: 'Both'      },
];

function ReadEase() {
  const [color,       setColor]       = useState();
  const [rulerHeight, setRulerHeight] = useState(80);
  const [blurAmount,  setBlurAmount]  = useState(4);
  const [dimAmount,   setDimAmount]   = useState(0.5);
  const [effectType,  setEffectType]  = useState('both');
    const [isActive,    setIsActive]    = useState(false); 

  const currentSettings = useCallback(() => ({
    color, rulerHeight, blurAmount, dimAmount, effectType
  }), [color, rulerHeight, blurAmount, dimAmount, effectType]);

  const getTab = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  };

  // src/ReadEase.jsx içindeki sendMessage fonksiyonu
  const sendMessage = async (action, extra = {}) => {
    try {
      const tab = await getTab();
      if (!tab?.id) return;
      
      const url = tab.url || '';
      if (/^(chrome|edge|about|moz-extension):/.test(url)) {
        if (action === 'applyRuler') alert('Bu sayfa tarayıcıya ait özel bir sayfadır. Lütfen normal bir web sitesinde deneyin.');
        return;
      }
      
      chrome.tabs.sendMessage(tab.id, { action, ...extra }, (response) => {
        if (chrome.runtime.lastError) {
          if (action === 'applyRuler') console.warn("Sayfayı yenilemeniz gerekebilir.");
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ── APPLY BUTTON HANDLER ─────────────────────────────
  const handleApply = async () => {
    await sendMessage('applyRuler', { settings: currentSettings() });
  };

  // ── LIVE UPDATE (while ruler is active) ─────────────
  const liveUpdate = useCallback(async (patch) => {
    await sendMessage('updateRuler', { settings: { ...currentSettings(), ...patch } });
  }, [currentSettings]);
    // ── REMOVE BUTTON HANDLER ─────────────────────────────
  const handleRemove = async () => {
    await sendMessage('removeRuler');
    setIsActive(false);
  };

  const onColor = (k) => { setColor(k); liveUpdate({ color: k }); };
  const onEffect = (k) => { setEffectType(k); liveUpdate({ effectType: k }); };
  const onHeight = (v) => { setRulerHeight(v); liveUpdate({ rulerHeight: v }); };
  const onBlur   = (v) => { setBlurAmount(v);  liveUpdate({ blurAmount: v }); };
  const onDim    = (v) => { setDimAmount(v);   liveUpdate({ dimAmount: v }); };

  return (
    <div className="re-popup">
      <header className="re-header">
        <div className="re-logo">ReadEase</div>
      </header>

      <div className="re-body">

        {/* Ruler Color */}
        <section className="re-section">
          <label className="re-label">Ruler Color</label>
          <div className="re-colors">
            {COLORS.map(c => (
              <button
                key={c.key}
                className={`re-color-swatch ${color === c.key ? 're-color-swatch--active' : ''}`}
                style={{ '--swatch': c.hex }}
                onClick={() => onColor(c.key)}
                aria-label={c.label}
                title={c.label}
              />
            ))}
          </div>
        </section>

        {/* Effect Type */}
        <section className="re-section">
          <label className="re-label">Overlay Effect</label>
          <div className="re-effect-group">
            {EFFECT_OPTIONS.map(o => (
              <label key={o.key} className={`re-radio-pill ${effectType === o.key ? 're-radio-pill--active' : ''}`}>
                <input
                  type="radio"
                  name="effectType"
                  value={o.key}
                  checked={effectType === o.key}
                  onChange={() => onEffect(o.key)}
                />
                {o.label}
              </label>
            ))}
          </div>
        </section>

        {/* Ruler Height */}
        <section className="re-section">
          <label className="re-label">Ruler Height <span className="re-value">{rulerHeight}px</span></label>
          <input
            type="range"
            className="re-slider"
            min="30"
            max="200"
            value={rulerHeight}
            onChange={e => onHeight(Number(e.target.value))}
          />
        </section>

        {/* Blur */}
        {effectType !== 'dim' && (
          <section className="re-section">
            <label className="re-label">Blur Intensity <span className="re-value">{blurAmount}px</span></label>
            <input
              type="range"
              className="re-slider"
              min="0"
              max="16"
              value={blurAmount}
              onChange={e => onBlur(Number(e.target.value))}
            />
          </section>
        )}

        {/* Dim */}
        {effectType !== 'blur' && (
          <section className="re-section">
            <label className="re-label">Dim Intensity <span className="re-value">{Math.round(dimAmount*100)}%</span></label>
            <input
              type="range"
              className="re-slider"
              min="0"
              max="0.85"
              step="0.01"
              value={dimAmount}
              onChange={e => onDim(Number(e.target.value))}
            />
          </section>
        )}

          <section className="re-section">
            <button className="re-apply-btn" onClick={handleRemove}>
              Remove Ruler
            </button>
          </section>

      </div>
    </div>
  );
}

export default ReadEase;