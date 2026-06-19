import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore"; // 🟢 FIXED: Firestore methods import kiye
import { db } from "../firebase"; // 🟢 FIXED: Firebase config import kiya
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import CartFab from "../components/cart/CartFab";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Button from "../components/common/Button";
import { contactInfo, products } from "../data/siteData";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);
  const { addToCart, openCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  
  // 🟢 FIXED: Hardcoded reviews ko khali state se badla aur loading lagaya
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // 🟢 FIXED: Database se live feedbacks load karne ke liye useEffect lagaya
  useEffect(() => {
    const q = query(collection(db, "feedbacks"), where("approved", "==", true));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          rating: doc.data().rating,
          comment: doc.data().review, // Humare form mein name 'review' tha, yahan mapping de di
        }));
        setReviews(fetchedReviews);
        setLoadingReviews(false);
      },
      (err) => {
        console.error("Error loading reviews for product detail:", err);
        setLoadingReviews(false);
      }
    );

    return unsubscribe;
  }, []);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi DogarVision, I want to order ${product.name}.`)}`;

  const discountedPrice = product.discountPercentage > 0
    ? product.originalPrice * (1 - product.discountPercentage / 100)
    : product.originalPrice;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const maxQuantity = product.stockCount > 0 ? product.stockCount : 999;
    const newQuantity = Math.max(1, Math.min(value, maxQuantity));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product.stockCount === 0) return;
    addToCart(product, quantity);
    openCart();
  };

  const isOutOfStock = product.stockCount === 0;

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
              <p className="product-detail__desc">{product.desc}</p>
              
              {/* Price Section with Discount */}
              <div className="product-detail__price-section">
                {product.discountPercentage > 0 && (
                  <>
                    <span className="product-detail__original-price">Rs. {product.originalPrice} / {product.unit}</span>
                    <span className="product-detail__discount-badge">{product.discountPercentage}% OFF</span>
                  </>
                )}
                <p className="product-detail__price">
                  Rs. {discountedPrice.toFixed(0)} / {product.unit}
                </p>
              </div>

              {/* Stock Management */}
              <div className="product-detail__stock-section">
                {isOutOfStock ? (
                  <span className="product-detail__stock-badge product-detail__stock-badge--out">
                    Out of Stock
                  </span>
                ) : (
                  <span className="product-detail__stock-badge product-detail__stock-badge--in">
                    In Stock ({product.stockCount} remaining)
                  </span>
                )}
              </div>

              {/* Quantity Controller */}
              <div className="product-detail__quantity-section">
                <label className="product-detail__quantity-label">Quantity:</label>
                <div className="product-detail__quantity-controls">
                  <button
                    type="button"
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="product-detail__quantity-input"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stockCount > 0 ? product.stockCount : 999}
                    disabled={isOutOfStock}
                  />
                  <button
                    type="button"
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(Math.min(product.stockCount > 0 ? product.stockCount : 999, quantity + 1))}
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-detail__actions">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
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

      {/* Customer Reviews Section */}
      <section className="section product-detail__reviews">
        <div className="container">
          <h2 className="product-detail__section-title">
            Customer Reviews <span>/ Khareedar ki Raaye</span>
          </h2>
          <div className="product-detail__reviews-list">
            {/* 🟢 FIXED: Loading aur Empty state lagayi database logic ke mutabiq */}
            {loadingReviews ? (
              <p className="feedback__status">Loading database reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="feedback__status" style={{ gridColumn: "1 / -1", width: "100%" }}>No reviews yet. Be the first to share your experience on home page!</p>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="product-detail__review-card">
                  <div className="product-detail__review-header">
                    <h3 className="product-detail__review-name">{review.name}</h3>
                    <div className="product-detail__review-rating">
                      {Array(review.rating).fill("⭐").join("")}
                    </div>
                  </div>
                  <p className="product-detail__review-comment">{review.comment}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* <section className="section product-detail__section">
        <div className="container">
          <h2 className="product-detail__section-title">
            Product Details <span>/ Tafseel</span>
          </h2>
          <p className="product-detail__section-desc">
            Learn more about our premium quality products and why customers trust DogarVision.
          </p>
        </div>
      </section> */}

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