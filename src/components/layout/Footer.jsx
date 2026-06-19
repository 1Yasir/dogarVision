import { Link, useLocation } from "react-router-dom"; // 🟢 FIXED: Link aur useLocation import kiya
import { contactInfo, footerLinks } from "../../data/siteData";

export default function Footer() {
  const location = useLocation();

  // Smooth scroll handle for footer links
  const handleFooterLinkClick = (e, href) => {
    const sectionId = href.replace("/#", "");
    
    if (location.pathname === "/") {
      e.preventDefault(); // Browser refresh rokay ga
      window.history.pushState(null, null, href); // URL update kare ga bina refresh ke
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
                  {/* 🟢 FIXED: <a> tag ko <Link> se badal diya aur smooth scroll lagaya */}
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

          <div>
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-item">
              <span>📞</span>
              <a href={`tel:${contactInfo.phone}`} className="footer__contact-link">
                {contactInfo.phone}
              </a>
            </div>
            <div className="footer__contact-item">
              <span>💬</span>
              {/* 🟢 TIP: WhatsApp link ko tel: ki jagah href par direct call ya chat par lagaya ja sakta hai */}
              <a href={`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="footer__contact-link">
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