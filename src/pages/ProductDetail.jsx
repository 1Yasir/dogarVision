import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import CartFab from "../components/cart/CartFab";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Button from "../components/common/Button";
import { contactInfo } from "../data/siteData";
import { productDetails } from "../data/productDetails";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = productDetails[productId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(product.whatsappMessage)}`;

  return (
    <div className="poultry product-detail-page">
      <NavBar />

      <header className="product-detail__hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: product.name, to: `/product/${productId}` },
            ]}
          />
        </div>
        <div className="container product-detail__hero-inner">
          <span className="product-detail__badge">{product.badge}</span>
          <div className="product-detail__hero-grid">
            <div>
              <p className="product-detail__label">DogarVision Specialty</p>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__tagline">{product.tagline}</p>
              <p className="product-detail__desc">{product.desc}</p>
              <p className="product-detail__price">{product.price}</p>
              <div className="product-detail__actions">
                <Button href={whatsappUrl} variant="accent">
                  Order via WhatsApp
                </Button>
                <Link to="/" className="btn btn--outline">
                  Back to Home
                </Link>
              </div>
            </div>
            <div className="product-detail__visual" aria-hidden="true">
              <span className="product-detail__emoji">{product.emoji}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="section product-detail__section">
        <div className="container">
          <h2 className="product-detail__section-title">
            Ingredients <span>/ Shamil Ajza</span>
          </h2>
          <p className="product-detail__section-desc">
            Every jar is made with carefully selected, premium-quality ingredients for authentic homemade taste.
          </p>
          <div className="product-detail__ingredients">
            {product.ingredients.map((item) => (
              <article key={item.name} className="product-detail__ingredient-card">
                <span className="product-detail__ingredient-icon">{item.icon}</span>
                <h3 className="product-detail__ingredient-name">{item.name}</h3>
                <p className="product-detail__ingredient-urdu">{item.urdu}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt product-detail__section">
        <div className="container">
          <h2 className="product-detail__section-title">Benefits</h2>
          <p className="product-detail__section-desc">
            Why families and retailers choose our premium homemade achar.
          </p>
          <div className="product-detail__benefits">
            {product.benefits.map((benefit) => (
              <article key={benefit.title} className="product-detail__benefit-card">
                <span className="product-detail__benefit-icon">{benefit.icon}</span>
                <h3 className="product-detail__benefit-title">{benefit.title}</h3>
                <p className="product-detail__benefit-desc">{benefit.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail__cta">
        <div className="container product-detail__cta-inner">
          <h2 className="product-detail__cta-title">Ready to order?</h2>
          <p className="product-detail__cta-desc">
            Message us on WhatsApp for pricing, bulk orders, and fast delivery.
          </p>
          <div className="product-detail__actions product-detail__actions--center">
            <Button href={whatsappUrl} variant="accent">
              Order via WhatsApp
            </Button>
            <Link to="/" className="btn btn--outline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <CartFab />
    </div>
  );
}
