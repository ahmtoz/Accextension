import { useState } from 'react';
import './popup.css';
import ColorSense from './colorsense/ColorSense';
import ReadEase from './readease/ReadEase';
import KeyNav from './keynav/KeyNav';

function Popup() {
  const [activeTab, setActiveTab] = useState(null);

  if (activeTab === 'colorsense') {
    return <ColorSense onBack={() => setActiveTab(null)} />;
  }

  if (activeTab === 'readease') {
    return <ReadEase onBack={() => setActiveTab(null)} />;
  }

  if (activeTab === 'keynav') {
    return <KeyNav onBack={() => setActiveTab(null)} />;
  }

  return (
    <div className="popup-container">
      <h3>Accextension</h3>

      <div className="main-menu">
        <button
          className="menu-btn"
          onClick={() => setActiveTab('colorsense')}
        >
          <img src="/images/extension-tab-colorsense.svg" alt="ColorSense" />
          <span>ColorSense</span>
        </button>
        <button
          className="menu-btn"
          onClick={() => setActiveTab('readease')}
        >
          <img src="/images/extension-tab-readease.svg" alt="ReadEase" />
          <span>ReadEase</span>
        </button>
        <button
          className="menu-btn"
          onClick={() => setActiveTab('keynav')}
        >
          <img src="/images/extension-tab-keynav.svg" alt="KeyNav" />
          <span>KeyNav</span>
        </button>
      </div>
    </div>
  );
}

export default Popup;
