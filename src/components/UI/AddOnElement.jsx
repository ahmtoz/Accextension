function AddOnElement({ img, altText, heading, text, btnText, href }) {
    return (
        <div className="addon-element">
            <img src={img} alt={altText} />
            <h3>{heading}</h3>
            <p>{text}</p>
            <a href={href} target="_blank" rel="noopener noreferrer">{btnText}</a>
        </div>
    );
}

export default AddOnElement;