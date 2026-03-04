function KeyNav({ onBack }) {
    return (
        <div className="popup-container">
            <div>
                <h3>KeyNav</h3>
                <button type="button" onClick={onBack}>Back to Menu</button>
            </div>
            <div>
                <p>KeyNav settings will go here.</p>
            </div>
        </div>
    );
}

export default KeyNav;
