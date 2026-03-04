import { useState } from 'react';
import './styles/popup.css';
import ColorSense from './components/ColorSense';
import ReadEase from './components/ReadEase';
import KeyNav from './components/KeyNav';

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
      <p>
        Select an accessibility tool to customize your experience.
      </p>

      <div className="main-menu">
        <button
          className="menu-btn"
          onClick={() => setActiveTab('colorsense')}
        >
          <span>ColorSense</span>
        </button>
        <button
          className="menu-btn"
          onClick={() => setActiveTab('readease')}
        >
          <span>ReadEase</span>
        </button>
        <button
          className="menu-btn"
          onClick={() => setActiveTab('keynav')}
        >
          <span>KeyNav</span>
        </button>
      </div>
    </div>
  );
}

export default Popup;
