import { contactInfo, footerLinks } from "../../data/siteData";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <span>🐔</span> DogarVision
            </div>
            <p className="footer__desc">
              Providing fresh, healthy, and premium poultry products with the highest biosecurity and hygiene standards.
            </p>
          </div>

          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="footer__link">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-item">
              <span>📞</span>
              <a href="tel:+923044169153" className="footer__contact-link">
                {contactInfo.phone}
              </a>
            </div>
            <div className="footer__contact-item">
              <span>💬</span>
              <a href="tel:+923044169153" className="footer__contact-link">
                WhatsApp: {contactInfo.whatsapp}
              </a>
            </div>
            <div className="footer__contact-item">
              <span>📍</span>
              <span>{contactInfo.address}</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 DogarVision Poultry Farm. All rights reserved.</span>
          <span>Fresh · Organic · Trusted</span>
        </div>
      </div>
    </footer>
  );
}
