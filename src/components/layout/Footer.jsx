import { Link, useLocation } from "react-router-dom";
import { contactInfo, footerLinks } from "../../data/siteData";

export default function Footer() {
  const location = useLocation();

  const handleFooterLinkClick = (e, href) => {
    const sectionId = href.replace("/#", "");
    if (location.pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, null, href);
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="container">

        {/* Main Grid */}
        <div className="footer__grid">

          {/* Brand Column */}
          <div>
            <div className="footer__brand">
              <span aria-hidden="true">🐔</span>
              DogarVision
            </div>
            <p className="footer__desc">
              Providing fresh, healthy, and premium poultry products with the
              highest biosecurity and hygiene standards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="footer__link"
                    onClick={(e) => handleFooterLinkClick(e, href)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer__heading">Contact Us</h4>

            <div className="footer__contact-item">
              <span aria-hidden="true">📞</span>
              <a
                href={`tel:${contactInfo.phone}`}
                className="footer__contact-link"
              >
                {contactInfo.phone}
              </a>
            </div>

            <div className="footer__contact-item">
              <span aria-hidden="true">💬</span>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="footer__contact-link"
              >
                WhatsApp: {contactInfo.whatsapp}
              </a>
            </div>

            <div className="footer__contact-item">
              <span aria-hidden="true">📍</span>
              <span className="footer__desc">{contactInfo.address}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <span>&#169; 2026 DogarVision Poultry Farm. All rights reserved.</span>
          <span>Fresh &#183; Organic &#183; Trusted</span>
        </div>

      </div>
    </footer>
  );
}