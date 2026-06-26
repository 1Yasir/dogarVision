import { features } from "../../data/siteData";
import { aboutCopy } from "../../data/copy";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";

export default function AboutSection() {
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <SectionTitle
          label={aboutCopy.label}
          title={aboutCopy.title}
          desc={aboutCopy.desc}
        />

        <div className="features-grid">
          {features.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={aboutCopy.features[key].title}
              desc={aboutCopy.features[key].desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
