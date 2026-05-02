import '../styles/footer.css';
import { NavLink } from 'react-router-dom';
import FooterLogo from '../assets/images/footer-logo.svg';
import EmailIcon from '../assets/images/footer-mail.svg';
import LocationIcon from '../assets/images/footer-location.svg';

export function Footer() {
    return (
        <footer id='contact'>
            <div className="footer-container">
                <div className="mobile-wrapper">
                    <div className="links">
                        <a href="#">
                            <img src={FooterLogo} alt="Footer Logo" />
                        </a>
                        <p>Quick Links</p>
                        <ul>
                            <li><a
                                href='#'
                                onClick={() => {
                                    document
                                        .getElementById("contact")
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >Home</a></li>
                            <li>
                                <NavLink
                                    to="/#features-section"

                                >
                                    Extension
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        isActive ? "active" : ""
                                    }
                                    onClick={() => window.scrollTo(0, 0)}
                                >About us
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='contact-info'>
                        <p>Contact Us</p>
                        <p>Have questions or feedbacks? Reach out to us. </p>
                        <div>
                            <div className="footer-icon-container">
                                <img src={EmailIcon} alt="Email Icon" />
                            </div>
                            <span><a href="mailto:accextension.offical@gmail.com">accextension.offical@gmail.com</a></span>
                        </div>
                        <div>
                            <div className="footer-icon-container">
                                <img src={LocationIcon} alt="Location Icon" />
                            </div>
                            <span>Ankara / Turkey</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>© 2025 - Accextension - All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;