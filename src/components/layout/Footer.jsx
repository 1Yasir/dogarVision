import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { contactInfo, footerLinks } from "../../data/siteData";

export default function Footer() {
  const location = useLocation();

  const handleFooterLinkClick = (e, href) => {
    const sectionId = href.replace("/#", "");

    if (location.pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, null, href);
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-body-tertiary border-top mt-5 py-5">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <div className="fw-bold fs-5 mb-2">
              <span aria-hidden="true">🐔</span> DogarVision
            </div>
            <p className="text-muted mb-0">
              Providing fresh, healthy, and premium poultry products with the highest biosecurity and hygiene standards.
            </p>
          </Col>

          <Col md={4}>
            <h4 className="h6 fw-semibold mb-3">Quick Links</h4>
            <ul className="list-unstyled mb-0">
              {footerLinks.map(({ label, href }) => (
                <li key={label} className="mb-2">
                  <Link
                    to={href}
                    className="text-decoration-none"
                    onClick={(e) => handleFooterLinkClick(e, href)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col md={4}>
            <h4 className="h6 fw-semibold mb-3">Contact Us</h4>
            <div className="mb-2">
              <span aria-hidden="true">📞</span>
              <a href={`tel:${contactInfo.phone}`} className="ms-2 text-decoration-none">
                {contactInfo.phone}
              </a>
            </div>
            <div className="mb-2">
              <span aria-hidden="true">💬</span>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="ms-2 text-decoration-none"
              >
                WhatsApp: {contactInfo.whatsapp}
              </a>
            </div>
            <div>
              <span aria-hidden="true">📍</span>
              <span className="ms-2 text-muted">{contactInfo.address}</span>
            </div>
          </Col>
        </Row>

        <Row className="mt-4 pt-3 border-top">
          <Col className="text-muted small d-flex flex-wrap justify-content-between gap-2">
            <span>© 2026 DogarVision Poultry Farm. All rights reserved.</span>
            <span>Fresh · Organic · Trusted</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}