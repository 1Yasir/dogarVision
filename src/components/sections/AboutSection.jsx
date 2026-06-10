import { features } from "../../data/siteData";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";

export default function AboutSection() {
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <SectionTitle
          label="About Us"
          title="Why Choose Our Products?"
          desc="Hard work, strict bio-security, and high-quality feed ensure that our poultry is completely healthy and organic. We serve wholesale buyers, grocery stores, restaurants, and direct consumers."
        />

        <div className="features-grid">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
