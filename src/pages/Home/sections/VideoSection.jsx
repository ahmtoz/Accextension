import "../styles/videoSection.css";

function VideoSection() {
  return (
    <section id="video-section">
        <div className="video-section-container">
            <h3>Explore Our Porducts</h3>
            <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/aOkLTd7rlNc"
                  title="YouTube Shorts video"
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