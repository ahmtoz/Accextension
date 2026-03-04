import AddOnElement from "../../../components/UI/AddOnElement";
import '../styles/featuresSection.css';
import Feat1 from '../../../assets/images/feat1.png';
import Feat2 from '../../../assets/images/feat2.png';
import Feat3 from '../../../assets/images/feat3.png';

function FeaturesSection() {
  return (
    <section id="features-section">
        <div className="features-container">
            <div className="features-header">
                <h2>Look at our extensions</h2>
            </div>
            <div className="features-items-container">
                <AddOnElement
                  img={Feat1}
                  altText="feature section image 1"
                  heading="Colorsense"
                  text="Adjust colors for clear distinction of all webpage elements."
                  btnText="Get Extension"
                  onClick={() => {
                    window.open("https://chromewebstore.google.com/detail/easeo/pcafeehdhcnmfbbjdgfdenfkianbcbee", "_blank")
                  }}
                />
                <AddOnElement
                  img={Feat2}
                  altText="feature section image 2"
                  heading="Readease"
                  text="Reformats text with specialized fonts and spacing for easy read. "
                  btnText="Coming Soon"
                />
                <AddOnElement
                  img={Feat3}
                  altText="feature section image 3"
                  heading="Keynav"
                  text="Enable full mouse-free website navigation using only keyboard. "
                  btnText="Coming Soon"
                />
            </div>    
        </div>
    </section>
  );
}

export default FeaturesSection;