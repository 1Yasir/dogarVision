import { aboutCopy } from "../../data/copy";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";

// Har key ke mutabiq icon ka map (Agriculture scale ke mutabiq icons set kiye hain)
const iconMap = {
  naturalFarming: "🌱", // Biosecurity/Organic feed ki jagah sustainable agriculture leaf
  biosecurity: "🛡️",   // Strict hygiene control shield
  globalSupply: "🌐",  // Consistent distribution/export globe
};
export default function AboutSection() {
  // Yahan ?. aur || {} ka use karein taakay agar copy file load na ho to crash na ho
  const features = aboutCopy?.features || {}; 
  const featureKeys = Object.keys(features);

  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <SectionTitle
          label={aboutCopy?.label}
          title={aboutCopy?.title}
          desc={aboutCopy?.desc}
        />

        <div className="features-grid">
          {featureKeys.map((key) => (
            <FeatureCard
              key={key}
              icon={iconMap[key] || "✨"}
              // Yahan bhi ?. ka use karein taakay object access safe ho
              title={features[key]?.title}
              desc={features[key]?.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}