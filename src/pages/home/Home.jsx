import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import HeroSection from './sections/HeroSection.jsx';
import ColorBlindnessTestSection from './sections/ColorBlindnessTestSection.jsx';
import InfoSection from './sections/InfoSection.jsx';
import FeaturesSection from './sections/FeaturesSection.jsx';
import VideoSection from './sections/VideoSection.jsx';
import Footer from '../../components/Footer.jsx';
import '../../styles/home.css';

function Home() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner on mount if not dismissed in this session
    const isClosed = sessionStorage.getItem('colorBlindTestBannerClosed');
    if (!isClosed) {
      setShowBanner(true);
    }
  }, []);

  const handleCloseBanner = () => {
    sessionStorage.setItem('colorBlindTestBannerClosed', 'true');
    setShowBanner(false);
  };

  const handleScrollToTest = (e) => {
    e.preventDefault();
    const testSection = document.getElementById('color-blindness-test');
    if (testSection) {
      testSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Automatically close/hide banner after clicking
    handleCloseBanner();
  };

  return (
    <>
      {showBanner && (
        <div className="test-promo-banner">
          <div className="test-promo-content">
            👁️ Not sure about your color vision?
            <a href="#color-blindness-test" onClick={handleScrollToTest} className="test-promo-link">
              Take our interactive Color Blindness Test now! →
            </a>
          </div>
          <button onClick={handleCloseBanner} className="test-promo-close" aria-label="Close banner">
            &times;
          </button>
        </div>
      )}
      <header>
        <Navbar />
      </header>    
      <main>
        <HeroSection />
        <ColorBlindnessTestSection />
        <InfoSection />
        <FeaturesSection />
        <VideoSection />
        <Footer />
      </main>
    </>
  )
}

export default Home;