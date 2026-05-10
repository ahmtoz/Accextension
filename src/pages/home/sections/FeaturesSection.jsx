import AddOnElement from "../../../components/UI/AddOnElement";
import '../styles/featuresSection.css';
import Feat1 from '../../../assets/images/feat1.png';
import Feat2 from '../../../assets/images/feat2.png';
import Feat3 from '../../../assets/images/feat3.png';

function FeaturesSection() {
  const chromeWebStoreUrl = "https://chromewebstore.google.com/detail/accextension/pcafeehdhcnmfbbjdgfdenfkianbcbee";

  return (
    <section id="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Look at our extensions</h2>
        </div>
        <div className="features-items-container">
          <AddOnElement
            img={Feat1}
            altText="Colorsense Extension Icon"
            ariaHidden="true"
            heading="Colorsense"
            text="Adjust colors for clear distinction of all webpage elements."
            btnText="Get Extension"
            href={chromeWebStoreUrl}
          />
          <AddOnElement
            img={Feat2}
            altText="Readease Extension Icon"
            ariaHidden="true"
            heading="Readease"
            text="Reformats text with specialized fonts and spacing for easy read. "
            btnText="Get Extension"
            href={chromeWebStoreUrl}
          />
          <AddOnElement
            img={Feat3}
            altText="Keynav Extension Icon"
            ariaHidden="true"
            heading="Keynav"
            text="Enable full mouse-free website navigation using only keyboard. "
            btnText="Get Extension"
            href={chromeWebStoreUrl}
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;