import Navbar from '../../components/Navbar.jsx';
import HeroSection from './sections/HeroSection.jsx';
import InfoSection from './sections/InfoSection.jsx';
import FeaturesSection from './sections/FeaturesSection.jsx';
import Footer from '../../components/Footer.jsx';
import '../../styles/home.css';

function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>    
      <main>
        <HeroSection />
        <InfoSection />
        <FeaturesSection />
        <Footer />
      </main>
    </>
  )
}

export default Home;