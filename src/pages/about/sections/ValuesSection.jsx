import "../styles/valuesSection.css";
import ValueOne from "../../../assets/images/value1.png";
import ValueTwo from "../../../assets/images/value2.png";
import ValueThree from "../../../assets/images/value3.png";

function ValuesSection() {
    return (
        <section>
            <div className="values-section">
                <h2>Our Values</h2>
                <div className="values-list">
                    <ul>
                        <li>
                            <div>
                                <img src={ValueOne} alt="Integrity Icon" />
                                <div className="divider"></div>
                                <h3>Mission</h3>
                            </div>
                            <p>We design and develop accessibility-focused tools that are user-friendly, customizable, and research-driven.</p>
                        </li>
                        <li>
                            <div>
                                <img src={ValueTwo} alt="Innovation Icon" />
                                <div className="divider"></div>
                                <h3>Vision</h3>
                            </div>
                            <p>We envision a more inclusive digital environment where web content is accessible and adaptable for everyone.</p>
                        </li>
                        <li>
                            <div>
                                <img src={ValueThree} alt="Teamwork Icon" />
                                <div className="divider"></div>
                                <h3>Values</h3>
                            </div>
                            <p>We value inclusivity, user-centered design, and adherence to recognized accessibility standards and best practices.</p>
                        </li>
                    </ul>
                </div>
                <p>
                    That’s all about us.
                    <br />
                    Feel free to say hi! 
                </p>
            </div>
        </section>
    );
}

export default ValuesSection;