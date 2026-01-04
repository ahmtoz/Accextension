import '../styles/heroSection.css';
import heroImage from '../../../assets/images/hero-image.svg';
import cta1 from '../../../assets/images/cta1.svg';
import cta2 from '../../../assets/images/cta2.svg';

function HeroSection() {
    return(
        <section id='hero'>
            <div className="container">
                <div className="hero-information">
                    <h4>“Making the internet comfortable for everyone.”</h4>
                    <h1>Unlock the Web's Full Potential</h1>
                    <div className="hero-image hero-image-mobile">
                        <img src={heroImage} alt="Hero Image" />
                    </div>
                    <p>Easeo provides add-ons for a personalized experience. Overcomes color blindness, dyslexia, ADHD with smart, seamless integration.</p>
                    <div className="cta-buttons">
                        <button 
                        className="get-started"
                        onClick={() => window.open("https://github.com/ahmtoz/Easeo", "_blank")}
                        >Get Started Free <img src={cta1} alt="CTA1" /></button>
                        <button 
                        className="video"
                        onClick={() => {
                            document
                            .getElementById("video-section")
                            .scrollIntoView({ behavior: "smooth" });
                        }}
                        >Watch the Video <img src={cta2} alt="CTA2" /></button>
                    </div>
                </div>
                <div className="hero-image hero-image-desktop">
                    <img src={heroImage} alt="Hero Image" />
                </div>
            </div>
        </section>
    )
}

export default HeroSection;