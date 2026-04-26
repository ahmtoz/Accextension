import { useState } from 'react';
import './popup.css';
import ColorSense from './colorsense/ColorSense';
import ReadEase from './readease/ReadEase';
import KeyNav from './keynav/KeyNav';

function Popup() {
  const [activeTab, setActiveTab] = useState('colorsense');

  return (
    <div className="popup-container">
      <h3>Accextension</h3>

      <div className="main-menu">
        <button
          className={`menu-btn ${activeTab === 'colorsense' ? 'active' : ''}`}
          onClick={() => setActiveTab('colorsense')}
        >
          <img src={`/images/extension-tab-colorsense${activeTab === 'colorsense' ? '-selected.svg' : '.svg'}`} alt="ColorSense" />
          <span>ColorSense</span>
        </button>
        <button
          className={`menu-btn ${activeTab === 'readease' ? 'active' : ''}`}
          onClick={() => setActiveTab('readease')}
        >
          <img src={`/images/extension-tab-readease${activeTab === 'readease' ? '-selected.svg' : '.svg'}`} alt="ReadEase" />
          <span>ReadEase</span>
        </button>
        <button
          className={`menu-btn ${activeTab === 'keynav' ? 'active' : ''}`}
          onClick={() => setActiveTab('keynav')}
        >
          <img src={`/images/extension-tab-keynav${activeTab === 'keynav' ? '-selected.svg' : '.svg'}`} alt="KeyNav" />
          <span>KeyNav</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'colorsense' && <ColorSense />}
        {activeTab === 'readease' && <ReadEase />}
        {activeTab === 'keynav' && <KeyNav />}
      </div>
    </div>
  );
}

export default Popup;
