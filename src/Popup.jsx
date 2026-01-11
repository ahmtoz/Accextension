import { useState } from 'react';
import './styles/popup.css';

/* eslint-disable no-undef */
function Popup() {
  const [selectedType, setSelectedType] = useState(null);

  const handleApply = async () => {
    if (!selectedType) {
      alert('Please select a color blindness type');
      return;
    }

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we can inject scripts on this page
      const url = tab.url || '';
      if (url.startsWith('chrome://') || 
          url.startsWith('chrome-extension://') || 
          url.startsWith('edge://') ||
          url.startsWith('about:') ||
          url.startsWith('moz-extension://')) {
        alert('This extension cannot work on browser internal pages (chrome://, chrome-extension://, etc.).\n\nPlease open a regular website (like google.com, wikipedia.org) and try again.');
        return;
      }
      
      // Check if chrome.scripting is available
      if (!chrome.scripting || !chrome.scripting.executeScript) {
        alert('Scripting API is not available. Please make sure the extension has the "scripting" permission and reload the extension.');
        return;
      }
      
      // Check if content script is injected, if not, inject it
      let scriptInjected = false;
      try {
        await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
        scriptInjected = true;
      } catch {
        // Content script not loaded, inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          scriptInjected = true;
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (injectError) {
          console.error('Failed to inject script:', injectError);
          alert(`Cannot inject script on this page: ${injectError.message}\n\nThis usually means:\n1. You're on a browser internal page (chrome://)\n2. The page doesn't allow script injection\n\nPlease try on a regular website like google.com`);
          return;
        }
      }
      
      if (!scriptInjected) {
        alert('Content script could not be loaded. Please refresh the page and try again.');
        return;
      }
      
      // Send message to content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'applyColorBlind',
        type: selectedType
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          alert(`Error: ${chrome.runtime.lastError.message}. Please refresh the page and try again.`);
        } else {
          console.log('Styles applied successfully', response);
          if (response && !response.success) {
            alert(`Error: ${response.error || 'Unknown error'}`);
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error applying styles: ${error.message}. Please refresh the page and try again.`);
    }
  };

  const handleRemove = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(tab.id, {
        action: 'removeColorBlind'
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
        } else {
          setSelectedType(null);
          console.log('Styles removed successfully');
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="popup-container">
      <h3>Easeo</h3>
      <div className='popup-options'>
        <div className="option">
          <div className="option-info">
            <img src="/images/protanopia.jpg" alt="Protanopia" style={{"height": "24px", "width": "43px"}}/>
            <span style={{paddingLeft: "12px"}}>Protanopia</span>
          </div>
          <input 
            type="radio" 
            name="colorBlindType" 
            id="protanopia"
            checked={selectedType === 'protanopia'}
            onChange={() => setSelectedType('protanopia')}
          />
        </div>
        <div className="option">
          <div className="option-info">
            <img src="/images/tritanopia.jpg" alt="Tritanopia" style={{"height": "24px", "width": "43px"}}/>
            <span style={{paddingLeft: "12px"}}>Tritanopia</span>
          </div>
          <input 
            type="radio" 
            name="colorBlindType" 
            id="tritanopia"
            checked={selectedType === 'tritanopia'}
            onChange={() => setSelectedType('tritanopia')}
          />
        </div>
        <div className="option">
          <div className="option-info">
            <img src="/images/deutritanopia.jpg" alt="Deuteranopia" style={{"height": "24px", "width": "43px"}}/>
            <span style={{paddingLeft: "12px"}}>Deuteranopia</span>
          </div>
          <input 
            type="radio" 
            name="colorBlindType" 
            id="deuteranopia"
            checked={selectedType === 'deuteranopia'}
            onChange={() => setSelectedType('deuteranopia')}
          />
        </div>
        <div className="option">
          <div className="option-info">
            <img src="/images/achromotopsia.jpg" alt="Achromatopsia" style={{"height": "24px", "width": "43px"}} />
            <span style={{paddingLeft: "12px"}}>Achromatopsia</span>
          </div>
          <input 
            type="radio" 
            name="colorBlindType" 
            id="achromatopsia"
            checked={selectedType === 'achromatopsia'}
            onChange={() => setSelectedType('achromatopsia')}
          />
        </div>
      </div>
      <div className="popup-buttons">
        <button type='button' onClick={handleApply}>Apply</button>
        <button type='button' onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
}

/* eslint-enable no-undef */
export default Popup;
