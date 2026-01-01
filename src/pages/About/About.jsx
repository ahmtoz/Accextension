import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import HeroSection from './sections/HeroSection.jsx';
import InfoSection from './sections/InfoSection.jsx';
import ValuesSection from './sections/ValuesSection.jsx';
import Footer from '../../components/Footer.jsx';

function About() {
  return (
    <>
      <header>
        <Navbar />
      </header>    
      <main>
        <HeroSection />
        <InfoSection />
        <ValuesSection />
        <Footer />
      </main>
    </>
  )
}

export default About;