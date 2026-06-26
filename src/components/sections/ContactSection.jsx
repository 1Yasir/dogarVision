import { contactInfo } from "../../data/siteData";
import { contactCopy } from "../../data/copy";
import SectionTitle from "../common/SectionTitle";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Sehjowal+Chak+No.+11,+Tehsil+Pattoki,+District+Kasur&t=&z=13&ie=UTF8&iwloc=&output=embed";

export default function ContactSection() {
  return (
    <section id="contact" className="section inquiry">
      <div className="container">
        <div className="inquiry__grid">

          {/* ── Left: Info ── */}
          <div>
            <SectionTitle
              label={contactCopy.label}
              title={contactCopy.title}
              desc={contactCopy.desc}
            />

            <div className="inquiry__info-list">

              {/* Phone */}
              <div className="inquiry__info-item">
                <div className="inquiry__info-icon" aria-hidden="true">
                  📞
                </div>
                <div>
                  <p className="inquiry__info-label">{contactCopy.phoneLabel}</p>
                  <a
                    href="tel:+923044169153"
                    className="inquiry__info-value inquiry__info-link"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="inquiry__info-item">
                <div className="inquiry__info-icon" aria-hidden="true">
                  📍
                </div>
                <div>
                  <p className="inquiry__info-label">{contactCopy.addressLabel}</p>
                  <p className="inquiry__info-value">{contactInfo.address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="inquiry__info-item">
                <div className="inquiry__info-icon" aria-hidden="true">
                  ⏰
                </div>
                <div>
                  <p className="inquiry__info-label">{contactCopy.hoursLabel}</p>
                  <p className="inquiry__info-value">{contactInfo.businessHours}</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Right: Map ── */}
          <div className="inquiry__map">
            <iframe
              className="inquiry__map-iframe"
              title="DogarVision Farm Location"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

        </div>
      </div>
    </section>
  );
}
