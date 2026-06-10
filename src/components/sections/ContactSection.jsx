import { contactInfo } from "../../data/siteData";
import SectionTitle from "../common/SectionTitle";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Sehjowal+Chak+No.+11,+Tehsil+Pattoki,+District+Kasur&t=&z=13&ie=UTF8&iwloc=&output=embed";

export default function ContactSection() {
  return (
    <section id="contact" className="section inquiry">
      <div className="container inquiry__grid">
        <div>
          <SectionTitle
            label="Get in Touch"
            title="Contact Us"
            desc="Reach out for orders, wholesale inquiries, or any questions about our farm-fresh products."
          />

          <div className="inquiry__info-list">
            <div className="inquiry__info-item">
              <div className="inquiry__info-icon">📞</div>
              <div>
                <div className="inquiry__info-label">Phone / WhatsApp</div>
                <a
                  href="tel:+923044169153"
                  className="inquiry__info-value inquiry__info-link"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            <div className="inquiry__info-item">
              <div className="inquiry__info-icon">📍</div>
              <div>
                <div className="inquiry__info-label">Farm Address</div>
                <div className="inquiry__info-value">{contactInfo.address}</div>
              </div>
            </div>
            <div className="inquiry__info-item">
              <div className="inquiry__info-icon">⏰</div>
              <div>
                <div className="inquiry__info-label">Business Hours</div>
                <div className="inquiry__info-value">{contactInfo.businessHours}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="inquiry__map">
          <iframe
            title="DogarVision Farm Location"
            src={MAP_EMBED_URL}
            className="inquiry__map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
