import { useState } from 'react';
import '../styles/navbar.css';
import Logo from '../assets/images/logo.png';

function Navbar () {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className='nav-logo'>
        <a href="#">
          <img src={Logo} alt="Easeo Logo" />
        </a>
      </div>
      
      <div className='hamburger' onClick={toggleMenu}>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar