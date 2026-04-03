import { useState } from 'react';
import './keynav.css';

/* eslint-disable no-undef */
function KeyNav() {
    const [isFocusEnabled, setIsFocusEnabled] = useState(false);

    const handleApply = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            const url = tab.url || '';
            if (url.startsWith('chrome://') ||
                url.startsWith('chrome-extension://') ||
                url.startsWith('edge://') ||
                url.startsWith('about:') ||
                url.startsWith('moz-extension://')) {
                alert('This extension cannot work on browser internal pages.');
                return;
            }

            if (!chrome.scripting || !chrome.scripting.executeScript) {
                alert('Scripting API is not available.');
                return;
            }

            let scriptInjected = false;
            try {
                await new Promise((resolve, reject) => {
                    chrome.tabs.sendMessage(tab.id, { action: 'pingKeyNav' }, (response) => {
                        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                        else resolve(response);
                    });
                });
                scriptInjected = true;
            } catch {
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content-keynav.js']
                    });
                    scriptInjected = true;
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error('Failed to inject script:', error);
                    alert('Cannot inject script on this page.');
                    return;
                }
            }

            if (!scriptInjected) return;

            chrome.tabs.sendMessage(tab.id, { action: 'applyKeyNav' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError);
                } else {
                    setIsFocusEnabled(true);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRemove = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            chrome.tabs.sendMessage(tab.id, { action: 'removeKeyNav' }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError);
                } else {
                    setIsFocusEnabled(false);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="keynav-content">
            <div className='popup-options'>
                <div className="option">
                    <div className="option-info">
                        <span>Global Focus Indicator</span>
                    </div>
                    <input
                        type="radio"
                        checked={isFocusEnabled}
                        onChange={(e) => {
                            if (e.target.checked) handleApply();
                            else handleRemove();
                        }}
                    />
                </div>
            </div>
            <div className="popup-buttons">
                <button onClick={handleApply}>Apply</button>
                <button onClick={handleRemove}>Remove</button>
            </div>
        </div>
    );
}

export default KeyNav;
