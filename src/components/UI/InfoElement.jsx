function InfoElement({ image, altText, text }) {
  return (
    <div className="info-item">
      <img src={image} alt={altText} />
      <p>{text}</p>
    </div>
  );
}

export default InfoElement;