import { useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import CartContent from "../components/cart/CartContent";
import SectionTitle from "../components/common/SectionTitle";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { useLanguage } from "../context/LanguageContext";

export default function CartPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="poultry cart-page">
      <NavBar />

      <main className="cart-page__main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: t("cart.breadcrumbHome"), to: "/" },
              { label: t("cart.breadcrumbCart"), to: "/cart" },
            ]}
          />

          <SectionTitle
            label={t("cart.label")}
            title={t("cart.title")}
            desc={t("cart.desc")}
          />

          <div className="cart-page__panel">
            <CartContent />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
