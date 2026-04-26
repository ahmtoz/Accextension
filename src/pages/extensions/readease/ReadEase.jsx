import { useState, useCallback } from 'react';
import './readease.css';

const COLORS = [
  { key: 'amber', label: 'Amber', hex: '#FFCE65' },
  { key: 'lime', label: 'Lime', hex: '#55D53F' },
  { key: 'sky', label: 'Sky', hex: '#06B6D4' },
  { key: 'violet', label: 'Violet', hex: '#8B5CF6' },
  { key: 'rose', label: 'Rose', hex: '#EF4444' },
  { key: 'white', label: 'White', hex: '#FFFFFF' },
  { key: 'black', label: 'Black', hex: '#000000' },
];

const EFFECT_OPTIONS = [
  { key: 'blur', label: 'Blur only' },
  { key: 'dim', label: 'Dım only' },
  { key: 'both', label: 'Both' },
];

function ReadEase() {
  const [color, setColor] = useState();
  const [rulerHeight, setRulerHeight] = useState(80);
  const [blurAmount, setBlurAmount] = useState(4);
  const [dimAmount, setDimAmount] = useState(0.5);
  const [effectType, setEffectType] = useState('both');
  const [isActive, setIsActive] = useState(false);
  const getPercent = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

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

  const handleApply = async () => {
    await sendMessage('applyRuler', { settings: currentSettings() });
  };

  const liveUpdate = useCallback(async (patch) => {
    await sendMessage('updateRuler', { settings: { ...currentSettings(), ...patch } });
  }, [currentSettings]);

  const handleRemove = async () => {
    await sendMessage('removeRuler');
    setIsActive(false);
  };

  const onColor = (k) => { setColor(k); liveUpdate({ color: k }); };
  const onEffect = (k) => { setEffectType(k); liveUpdate({ effectType: k }); };
  const onHeight = (v) => { setRulerHeight(v); liveUpdate({ rulerHeight: v }); };
  const onBlur = (v) => { setBlurAmount(v); liveUpdate({ blurAmount: v }); };
  const onDim = (v) => { setDimAmount(v); liveUpdate({ dimAmount: v }); };

  return (
    <div className="readease-content">

      {/* Ruler Color */}
      <section className="re-section-color">
        <h4 className="re-label-color">Ruler Colors</h4>
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
      <section className="re-section-effect">
        <h4 className="re-label-effect">Overlay Effect</h4>
        <div className="re-effect-group">
          {EFFECT_OPTIONS.map(o => (
            <label
              key={o.key}
              className={`re-radio-pill ${effectType === o.key ? 're-radio-pill--active' : ''}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEffect(o.key);
                }
              }}
            >
              <input
                type="radio"
                name="effectType"
                value={o.key}
                checked={effectType === o.key}
                onChange={() => onEffect(o.key)}
                tabIndex={-1}
              />
              {o.label}
            </label>
          ))}
        </div>


        {/* Ruler Height */}
        <section className="re-section-all">
          <label className="re-label-all">Ruler Height <span className="re-value">{rulerHeight}px</span></label>
          <input
            type="range"
            className="re-slider"
            min="30"
            max="200"
            value={rulerHeight}
            onChange={e => onHeight(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #000 ${getPercent(rulerHeight, 30, 200)}%, #E5E7EB ${getPercent(rulerHeight, 30, 200)}%)`
            }}
          />
        </section>

        {/* Blur */}
        {effectType !== 'dim' && (
          <section className="re-section-all">
            <label className="re-label-all">Blur Intensity <span className="re-value">{blurAmount}px</span></label>
            <input
              type="range"
              className="re-slider"
              min="0"
              max="16"
              value={blurAmount}
              onChange={e => onBlur(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #000 ${(blurAmount / 16) * 100}%, #E5E7EB ${(blurAmount / 16) * 100}%)`
              }}
            />
          </section>
        )}

        {/* Dim */}
        {effectType !== 'blur' && (
          <section className="re-section-all">
            <label className="re-label-all">Dim Intensity <span className="re-value">{Math.round(dimAmount * 100)}%</span></label>
            <input
              type="range"
              className="re-slider"
              min="0"
              max="0.85"
              step="0.01"
              value={dimAmount}
              onChange={e => onDim(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #000 ${getPercent(dimAmount, 0, 0.85)}%, #E5E7EB ${getPercent(dimAmount, 0, 0.85)}%)`
              }}
            />
          </section>
        )}
      </section>

      <section className="re-section">
        <button className="re-remove-btn" onClick={handleRemove}>
          Remove Ruler
        </button>
      </section>

    </div>
  );
}

export default ReadEase;