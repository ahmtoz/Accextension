import Navbar from './../../components/Navbar.jsx';
import HeroSection from './sections/HeroSection.jsx';
import InfoSection from './sections/InfoSection.jsx';
import FeaturesSection from './sections/FeaturesSection.jsx'
import './../../styles/home.css';

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
      </main>
    </>
  )
}

export default Home;