import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { features } from "../../data/siteData";
import { aboutCopy } from "../../data/copy";
import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";

export default function AboutSection() {
  return (
    <section id="about" className="py-5 bg-light">
      <Container>
        <SectionTitle
          label={aboutCopy.label}
          title={aboutCopy.title}
          desc={aboutCopy.desc}
        />

        <Row className="g-4 mt-2">
          {features.map(({ key, icon }) => (
            <Col key={key} md={4}>
              <FeatureCard
                icon={icon}
                title={aboutCopy.features[key].title}
                desc={aboutCopy.features[key].desc}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}