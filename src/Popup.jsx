import '../src/styles/popup.css';

function Popup() {
  return (
    <div className="popup-container">
      <h3>Easeo</h3>
      <div className='popup-options'>
        <div className="option">
          <div className="option-info">
            <img src="" alt="IMG1" />
            <span>Color Blindess</span>
          </div>
          <button type="button">Apply</button>
        </div>
        <div className="option">
          <div className="option-info">
            <img src="" alt="IMG2" />
            <span>Dyslexia</span>
          </div>
          <button type="button">Apply</button>
        </div>
        <div className="option">
          <div className="option-info">
            <img src="" alt="IMG2" />
            <span>Keyboard Nav</span>
          </div>
          <button type="button">Apply</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
