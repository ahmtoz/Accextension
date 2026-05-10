function InfoElement({ image, altText, ariaHidden, text }) {
  return (
    <div className="info-item">
      <img src={image} alt={altText} aria-hidden={ariaHidden} />
      <p>{text}</p>
    </div>
  );
}

export default InfoElement;