import AddOnElement from "../../../components/UI/AddOnElement";
import '../../../styles/featuresSection.css';
import Feat1 from '../../../assets/images/feat1.png';
import Feat2 from '../../../assets/images/feat2.png';
import Feat3 from '../../../assets/images/feat3.png';

function FeaturesSection() {
  return (
    <section>
        <div className="features-container">
            <div className="features-header">
                <h2>Look at our extensions</h2>
            </div>
            <div className="features-items-container">
                <AddOnElement
                  img={Feat1}
                  altText="feature section image 1"
                  heading="Color Blindness"
                  text="Adjust colors for clear distinction of all webpage elements."
                btnText="Get Extension"
                />
                <AddOnElement
                  img={Feat2}
                  altText="feature section image 2"
                  heading="Dyslexia"
                  text="Reformats text with specialized fonts and spacing for easy read. "
                  btnText="Coming Soon"
                />
                <AddOnElement
                  img={Feat3}
                  altText="feature section image 3"
                  heading="Keyboard Nav"
                  text="Enable full mouse-free website navigation using only keyboard. "
                  btnText="Coming Soon"
                />
            </div>    
        </div>
    </section>
  );
}

export default FeaturesSection;