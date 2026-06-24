import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { contactInfo } from "../../data/siteData";
import { contactCopy } from "../../data/copy";
import SectionTitle from "../common/SectionTitle";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Sehjowal+Chak+No.+11,+Tehsil+Pattoki,+District+Kasur&t=&z=13&ie=UTF8&iwloc=&output=embed";

export default function ContactSection() {
  return (
    <section id="contact" className="py-5">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={6}>
            <SectionTitle
              label={contactCopy.label}
              title={contactCopy.title}
              desc={contactCopy.desc}
            />

            <ListGroup className="mt-4 shadow-sm">
              <ListGroup.Item className="d-flex gap-3 align-items-start">
                <span aria-hidden="true">📞</span>
                <div>
                  <div className="fw-semibold small text-muted">
                    {contactCopy.phoneLabel}
                  </div>
                  <a href="tel:+923044169153" className="text-decoration-none">
                    {contactInfo.phone}
                  </a>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex gap-3 align-items-start">
                <span aria-hidden="true">📍</span>
                <div>
                  <div className="fw-semibold small text-muted">
                    {contactCopy.addressLabel}
                  </div>
                  <div>{contactInfo.address}</div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex gap-3 align-items-start">
                <span aria-hidden="true">⏰</span>
                <div>
                  <div className="fw-semibold small text-muted">
                    {contactCopy.hoursLabel}
                  </div>
                  <div>{contactInfo.businessHours}</div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col lg={6}>
            <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
              <iframe
                title="DogarVision Farm Location"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ border: 0 }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}