import { features } from "../../data/siteData";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <SectionTitle
          label={t("about.label")}
          title={t("about.title")}
          desc={t("about.desc")}
        />

        <div className="features-grid">
          {features.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`about.features.${key}.title`)}
              desc={t(`about.features.${key}.desc`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
