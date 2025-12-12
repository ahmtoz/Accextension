import '../../../styles/InfoSection.css';
import InfoElement from '../../../components/UI/InfoElement.jsx';

function InfoSection() {
    return (
        <section>
            <div className="info-container">
                <div className="info-header">
                    <h2>What is AccEase?</h2>
                    <p>AccesEase is an essential browser add-on dedicated to creating a truly inclusive internet experience for everyone. </p>
                </div>
                <div className="info-items-container">
                    <InfoElement 
                        img=""
                        altText="resim1"
                        text="AccesEase is an essential browser add-on dedicated to creating a truly inclusive internet experience
 for everyone."
                    />
                    <InfoElement 
                        img=""
                        altText="resim1"
                        text="AccesEase is an essential browser add-on dedicated to creating a truly inclusive internet experience
 for everyone."
                    />
                    <InfoElement 
                        img=""
                        altText="resim1"
                        text="AccesEase is an essential browser add-on dedicated to creating a truly inclusive internet experience
 for everyone."
                    />
                </div>
            </div>
        </section>
    );
}

export default InfoSection;