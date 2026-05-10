import '../styles/heroSection.css';
import heroImage from '../../../assets/images/hero-image.svg';
import cta1 from '../../../assets/images/cta1.svg';
import cta2 from '../../../assets/images/cta2.svg';
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section id='hero'>
            <div className="container">
                <div className="hero-information">
                    <h2>“Making the internet comfortable for everyone.”</h2>
                    <h1>Unlock the Web's Full Potential</h1>
                    <div className="hero-image">
                        <img src={heroImage} aria-hidden="true" loading="eager" fetchpriority="high" alt="Illustration showing accessibility tools for web browsing" />
                    </div>
                    <p>Accextension provides add-ons for a personalized experience. Overcomes color blindness, dyslexia, ADHD with smart, seamless integration.</p>
                    <div className="cta-buttons">
                        <Link
                            className="get-started-btn"
                            to="/#features-section"
                        >
                            Get Started Free <img src={cta1} alt="" aria-hidden="true" />
                        </Link>
                        <Link
                            className="video-btn"
                            to="/#video-section"
                        >
                            Watch the Video <img src={cta2} alt="" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;