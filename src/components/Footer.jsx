import './../styles/footer.css';

export function Footer() {
  return (
    <footer>
        <div className="footer-container">
            <div className="header">
                <p>Easeo</p>
            </div>
            <div className="mobile-wrapper">
                <div className="links">
                    <p>Useful Links</p>
                    <ul>
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#info">Extension</a></li>
                        <li><a href="#features">User guide</a></li>
                        <li><a href="#contact">About us</a></li>
                    </ul>
                </div>
                <div className='contact-info'>
                    <p>Contact info</p>
                    <p>Have questions? Reach out to us.</p>
                    <div>
                        <img src="" alt="" />
                        <span>easeo@gmail.com</span>
                    </div>
                    <div>
                        <img src="" alt="" />
                        <span>Ankara / Turkey</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="copyright">
            <p>© 2025 Easeo - All rights reserved.</p>
        </div>
    </footer>
  );
}

export default Footer;