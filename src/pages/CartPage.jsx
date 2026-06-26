import { useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import SeoHelmet from "../components/common/SeoHelmet";
import CartContent from "../components/cart/CartContent";
import SectionTitle from "../components/common/SectionTitle";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { cartCopy, seoCopy } from "../data/copy";

export default function CartPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="poultry">
      <SeoHelmet
        title={seoCopy.cart.title}
        description={seoCopy.cart.description}
        keywords={seoCopy.cart.keywords}
      />
      <NavBar />

      <main className="cart-page__main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: cartCopy.breadcrumbHome, to: "/" },
              { label: cartCopy.breadcrumbCart, to: "/cart" },
            ]}
          />

          <SectionTitle
            label={cartCopy.label}
            title={cartCopy.title}
            desc={cartCopy.desc}
          />

          <div style={{ marginTop: "24px" }}>
            <CartContent />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}