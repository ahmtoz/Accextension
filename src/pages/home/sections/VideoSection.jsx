import "../styles/videoSection.css";

function VideoSection() {
  return (
    <section id="video-section">
      <div className="video-section-container">
        <h2>Discover Accextension</h2>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/ddj4UGQiZR8?si=vbCqFyFXd09ubSkF"
            title="Accextension Promo Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;