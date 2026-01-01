import "../styles/infoSection.css";
import AboutImage from "../../../assets/images/about-image.png";

function InfoSection() {
    return (
        <section>
            <div className="about-info-section">
                <h2>Who are we?</h2>
                <div className="about-info-container">
                    <img src={AboutImage} alt="" />
                    <p>Easeo is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone. Easeo is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone. Easeo is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone.AccesEase is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone.</p>
                </div>
                <blockquote>
                    "Our mission is to empower individuals with disabilities by providing them with the tools they need to navigate the digital world with ease and confidence."
                </blockquote>
            </div>
        </section>
    );
}

export default InfoSection;