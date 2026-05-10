import '../styles/infoSection.css';
import InfoElement from '../../../components/UI/InfoElement.jsx';
import Info1 from '../../../assets/images/info1.svg';
import Info2 from '../../../assets/images/info2.svg';
import Info3 from '../../../assets/images/info3.svg';

function InfoSection() {
    return (
        <section>
            <div className="info-container">
                <div className="info-header">
                    <h2>What is Accextension?</h2>
                    <p>Accextension is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone. </p>
                </div>
                <div className="info-items-container">
                    <InfoElement
                        image={Info1}
                        altText="Navigate Icon"
                        ariaHidden="true"
                        text="This tools supports users in navigating online challenges by offering clear solutions that improve daily experiences."
                    />
                    <InfoElement
                        image={Info2}
                        altText="Help Icon"
                        ariaHidden="true"
                        text="Helps people overcome accessibility barriers by simplifying the web and enhancing everyday usability greatly."
                    />
                    <InfoElement
                        image={Info3}
                        altText="Accessibility Icon"
                        ariaHidden="true"
                        text="Empowers individuals facing digital difficulties by providing guidance tools that make browsing easier everywhere."
                    />
                </div>
            </div>
        </section>
    );
}

export default InfoSection;