import "../styles/VideoSection.css";

function VideoSection() {
  return (
    <section>
        <div className="video-section-container">
            <h3>Explore Our Porducts</h3>
            <div className="video-container">
                <iframe
                width="1120"
                height="630"
                src="https://www.youtube.com/embed/SOa3vIg8In4?si=vAF4t8tC3qAufrA2"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen></iframe>
            </div>
        </div>
    </section>
  );
}

export default VideoSection;