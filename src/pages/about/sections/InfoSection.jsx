import "../styles/infoSection.css";
import AboutImage from "../../../assets/images/about-image.svg";

function InfoSection() {
    return (
        <section>
            <div className="about-info-section">
                <h2>Who are we?</h2>
                <div className="about-info-container">
                    <img src={AboutImage} alt="" />
                    <p>Accextension is a browser-based accessibility add-on designed to support inclusive and adaptable web experiences. It provides users with tools that enable web content to be customized according to individual needs, promoting independent, comfortable, and accessible interaction with digital environments. Grounded in recognized accessibility standards, Accextension aims to contribute to a more equitable and user-centered web.</p>
                </div>
                <blockquote>
                    "We empower users by enabling web content to adapt to their individual needs through accessible, standards-based design."
                </blockquote>
            </div>
        </section>
    );
}

export default InfoSection;