import { contactInfo } from "../../data/siteData";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../common/SectionTitle";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Sehjowal+Chak+No.+11,+Tehsil+Pattoki,+District+Kasur&t=&z=13&ie=UTF8&iwloc=&output=embed";

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="section inquiry">
      <div className="container inquiry__grid">
        <div>
          <SectionTitle
            label={t("contact.label")}
            title={t("contact.title")}
            desc={t("contact.desc")}
          />

          <div className="inquiry__info-list">
            <div className="inquiry__info-item">
              <div className="inquiry__info-icon">📞</div>
              <div>
                <div className="inquiry__info-label">{t("contact.phoneLabel")}</div>
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
                <div className="inquiry__info-label">{t("contact.addressLabel")}</div>
                <div className="inquiry__info-value">{contactInfo.address}</div>
              </div>
            </div>
            <div className="inquiry__info-item">
              <div className="inquiry__info-icon">⏰</div>
              <div>
                <div className="inquiry__info-label">{t("contact.hoursLabel")}</div>
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
