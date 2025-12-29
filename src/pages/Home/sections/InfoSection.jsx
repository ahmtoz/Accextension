import '../../../styles/InfoSection.css';
import InfoElement from '../../../components/UI/InfoElement.jsx';
import Info1 from '../../../assets/images/info1.png';
import Info2 from '../../../assets/images/info2.png';
import Info3 from '../../../assets/images/info3.png';

function InfoSection() {
    return (
        <section>
            <div className="info-container">
                <div className="info-header">
                    <h2>What is Easeo?</h2>
                    <p>Easeo is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone. </p>
                </div>
                <div className="info-items-container">
                    <InfoElement 
                        image={Info1}
                        altText="easoe info image one"
                        text="This tools supports users in navigating online challenges by offering clear solutions that improve daily experiences."
                    />
                    <InfoElement 
                        image={Info2}
                        altText="easoe info image two"
                        text="Helps people overcome accessibility barriers by simplifying the web and enhancing everyday usability greatly."
                    />
                    <InfoElement 
                        image={Info3}
                        altText="easoe info image three"
                        text="Empowers individuals facing digital difficulties by providing guidance tools that make browsing easier everywhere."
                    />
                </div>
            </div>
        </section>
    );
}

export default InfoSection;