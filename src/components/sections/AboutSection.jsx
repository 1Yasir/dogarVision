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
  // copy.js ke andar jitni bhi keys hain unka array nikalna
  const featureKeys = Object.keys(aboutCopy.features);

  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <SectionTitle
          label={aboutCopy.label}
          title={aboutCopy.title}
          desc={aboutCopy.desc}
        />

        <div className="features-grid">
          {featureKeys.map((key) => (
            <FeatureCard
              key={key}
              icon={iconMap[key] || "✨"} // Sahi icon automatic select hoga
              title={aboutCopy.features[key].title}
              desc={aboutCopy.features[key].desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}