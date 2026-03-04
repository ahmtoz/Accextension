function ReadEase({ onBack }) {
    return (
        <div className="popup-container">
            <div>
                <h3>ReadEase</h3>
                <button type="button" onClick={onBack}>Back to Menu</button>
            </div>
            <div>
                <p>ReadEase settings will go here.</p>
            </div>
        </div>
    );
}

export default ReadEase;
