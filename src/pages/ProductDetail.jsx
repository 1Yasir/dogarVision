import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import CartFab from "../components/cart/CartFab";
import Breadcrumbs from "../components/common/Breadcrumbs";
import SeoHelmet from "../components/common/SeoHelmet";
import { contactInfo } from "../data/siteData";
import { seoCopy } from "../data/copy";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import {
  clampQuantity,
  roundQuantity,
  STOCK_MAX_MESSAGE,
} from "../utils/stockValidation";

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingDirect, setSubmittingDirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageBroken, setIsImageBroken] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsImageBroken(false); 
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    const productDocRef = doc(db, "products", productId);
    const unsubscribe = onSnapshot(
      productDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
        setLoadingProduct(false);
      },
      (err) => {
        console.error("Error loading product detail:", err);
        setLoadingProduct(false);
      }
    );
    return () => unsubscribe();
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    const q = query(
      collection(db, "feedbacks"),
      where("approved", "==", true),
      where("productId", "==", productId)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          rating: docSnap.data().rating,
          comment: docSnap.data().review,
        }));
        setReviews(fetchedReviews);
        setLoadingReviews(false);
      },
      (err) => {
        console.error("Error loading reviews:", err);
        setLoadingReviews(false);
      }
    );
    return () => unsubscribe();
  }, [productId]);

  if (loadingProduct) {
    return (
      <div className="bg-body min-vh-100 d-flex flex-column justify-content-between">
        <NavBar />
        <div className="container d-flex align-items-center justify-content-center flex-grow-1" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
          <p className="section-desc">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const unitType = product.unitType ?? "unit";
  const step = unitType === "kg" ? 0.5 : 1;
  const minQty = step;
  const baseOriginalPrice = product.originalPrice || product.unitPrice || 0;
  const baseUnitPrice = product.unitPrice || 0;
  const currentStock = Math.max(0, Number(product.stockCount) || 0);
  const discountedPrice =
    product.discountPercentage > 0
      ? baseOriginalPrice * (1 - product.discountPercentage / 100)
      : baseUnitPrice;
  const isOutOfStock = currentStock <= 0;
  const seo = seoCopy.product(product.name);

  const currentCategoryClass = product.category || "poultry";

  const applyQuantity = (rawValue) => {
    const rounded = roundQuantity(rawValue, unitType);
    const { value, hitMax } = clampQuantity(rounded, currentStock, minQty);
    if (hitMax) showToast(STOCK_MAX_MESSAGE, "warning");
    setQuantity(value);
  };

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) return;
    applyQuantity(value);
  };

  const handleDecreaseQuantity = () => applyQuantity(quantity - step);
  const handleIncreaseQuantity = () => applyQuantity(quantity + step);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setErrorMessage("This product is currently out of stock.");
      return;
    }
    const { value, hitMax } = clampQuantity(quantity, currentStock, minQty);
    if (hitMax) showToast(STOCK_MAX_MESSAGE, "warning");
    addToCart(product, value);
    openCart();
    setErrorMessage("");
  };

  const handleWhatsAppDirectOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (isOutOfStock || submittingDirect) return;
    setSubmittingDirect(true);
    try {
      const productRef = doc(db, "products", product.id);
      const freshSnap = await getDoc(productRef);
      if (!freshSnap.exists()) {
        setErrorMessage("Product not found. Please try again.");
        setSubmittingDirect(false);
        return;
      }
      const freshStock = Number(freshSnap.data().stockCount) || 0;
      if (freshStock < quantity) {
        setErrorMessage(
          `Only ${freshStock} ${product.unit || "unit"} available. Please update your quantity.`
        );
        setSubmittingDirect(false);
        return;
      }
      const orderQty = Number(quantity);
      const lineTotal = discountedPrice * orderQty;
      await addDoc(collection(db, "orders"), {
        name: "Direct WhatsApp Buyer",
        phone: "WhatsApp Contact",
        address: "Requested via Product Page",
        items: [
          {
            productName: product.name,
            quantity: `${orderQty} ${product.unit || "kg"}`,
            subtotal: lineTotal,
          },
        ],
        totalBill: lineTotal,
        createdAt: serverTimestamp(),
      });
      await updateDoc(productRef, {
        stockCount: increment(-orderQty),
      });
      const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi DogarVision, I want to order ${orderQty} ${product.unit || "kg"} of ${product.name}. Total: Rs. ${lineTotal}`
      )}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setErrorMessage("");
      setQuantity(1);
    } catch (err) {
      console.error("Direct order error:", err);
      setErrorMessage("Order processing failed. Please contact us on WhatsApp.");
    } finally {
      setSubmittingDirect(false);
    }
  };

  return (
    <div className={`${currentCategoryClass} product-detail-page`}>
      <SeoHelmet
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        type="product"
      />
      <NavBar />

      {/* ── Hero Section ── */}
      <div className="product-detail__hero">
        <div className="container">
          <div className="product-detail__hero-inner">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: product.name, to: `/product/${productId}` },
              ]}
            />

            <div className="product-detail__hero-grid">
              {/* Left: Info */}
              <div>
                {product.badge && (
                  <span className="product-detail__badge">{product.badge}</span>
                )}

                <p className="product-detail__label">DogarVision Specialty</p>
                <h1 className="product-detail__title">{product.name}</h1>
                <p className="product-detail__desc">{product.desc}</p>

                {/* Price */}
                <div className="product-detail__price-section">
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="product-detail__original-price">
                        Rs. {baseOriginalPrice} / {product.unit}
                      </span>
                      <span className="product-detail__discount-badge">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                  <span className="product-detail__price">
                    Rs. {discountedPrice.toFixed(0)} / {product.unit}
                  </span>
                </div>

                {/* Stock */}
                <div className="product-detail__stock-section">
                  {isOutOfStock ? (
                    <span className="product-detail__stock-badge product-detail__stock-badge--out">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="product-detail__stock-badge product-detail__stock-badge--in">
                      In Stock ({currentStock} remaining)
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="product-detail__quantity-section">
                  <label className="product-detail__quantity-label">Quantity</label>
                  <div className="product-detail__quantity-controls">
                    <button
                      className="product-detail__quantity-btn"
                      onClick={handleDecreaseQuantity}
                      disabled={isOutOfStock || submittingDirect || quantity <= step}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      className="product-detail__quantity-input"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min={step}
                      max={currentStock > 0 ? currentStock : step}
                      step={step}
                      disabled={isOutOfStock || submittingDirect}
                      aria-label="Quantity input"
                    />
                    <button
                      className="product-detail__quantity-btn"
                      onClick={handleIncreaseQuantity}
                      disabled={isOutOfStock || submittingDirect || quantity >= currentStock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Error */}
                {errorMessage && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      color: "#dc2626",
                      fontSize: "0.9375rem",
                      marginBottom: "16px",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Actions */}
                <div className="product-detail__actions">
                  <button
                    className="btn btn--primary"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || submittingDirect}
                  >
                    {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>
                  <button
                    className="btn btn--accent"
                    onClick={handleWhatsAppDirectOrder}
                    disabled={isOutOfStock || submittingDirect}
                  >
                    {submittingDirect ? "Processing..." : "💬 Order via WhatsApp"}
                  </button>
                  <Link to="/" className="btn btn--outline">
                    ← Back to Home
                  </Link>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="product-detail__visual">
                {product.imageUrl && !isImageBroken ? (
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} - DogarVision Marketplace`}
                    className="product-detail__img"
                    loading="eager"
                    onError={() => setIsImageBroken(true)}
                  />
                ) : (
                  <span className="product-detail__emoji" aria-hidden="true">
                    {product.emoji}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews ── */}
      <section className="section product-detail__reviews">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span className="section-label">Customer Reviews</span>
          </div>
          <h2 className="product-detail__section-title">
            What Our Customers <span>Say</span>
          </h2>

          {loadingReviews ? (
            <p className="section-desc" style={{ textAlign: "center" }}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="section-desc" style={{ textAlign: "center" }}>
              No reviews yet for this product. Be the first to share your experience on the home page!
            </p>
          ) : (
            <div className="product-detail__reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="product-detail__review-card">
                  <div className="product-detail__review-header">
                    <h3 className="product-detail__review-name">{review.name}</h3>
                    <span className="product-detail__review-rating">
                      {Array(review.rating).fill("★").join("")}
                    </span>
                  </div>
                  <p className="product-detail__review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <div className="product-detail__cta">
        <div className="container">
          <div className="product-detail__cta-inner">
            <h2 className="product-detail__cta-title">
              Ready to Order {product.name}?
            </h2>
            <p className="product-detail__cta-desc">
              Fresh, quality products delivered to your doorstep.
            </p>
            <div className="product-detail__actions product-detail__actions--center">
              <button
                className="btn btn--primary"
                onClick={handleAddToCart}
                disabled={isOutOfStock || submittingDirect}
              >
                {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
              </button>
              <button
                className="btn btn--accent"
                onClick={handleWhatsAppDirectOrder}
                disabled={isOutOfStock || submittingDirect}
              >
                💬 Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <Footer />
      <CartFab />
    </div>
  );
}