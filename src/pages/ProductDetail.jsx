import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { collection, onSnapshot, query, where, doc, addDoc, serverTimestamp, updateDoc, increment, getDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import CartFab from "../components/cart/CartFab";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Button from "../components/common/Button";
import { contactInfo } from "../data/siteData"; 
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, openCart } = useCart();
  const { t } = useLanguage();
  
  const [product, setProduct] = useState(null); 
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingDirect, setSubmittingDirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    const productDocRef = doc(db, "products", productId);
    const unsubscribe = onSnapshot(productDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct(null);
      }
      setLoadingProduct(false);
    }, (err) => {
      console.error("Error loading product detail:", err);
      setLoadingProduct(false);
    });

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
      snapshot => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          rating: doc.data().rating,
          comment: doc.data().review,
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
      <div className="poultry product-detail-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading Product Details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const baseOriginalPrice = product.originalPrice || product.unitPrice || 0;
  const baseUnitPrice = product.unitPrice || 0;
  const currentStock = Number(product.stockCount) || 0;

  const discountedPrice = product.discountPercentage > 0
    ? baseOriginalPrice * (1 - product.discountPercentage / 100)
    : baseUnitPrice;

  // ✅ Quantity change handler - min/max validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const maxQuantity = currentStock > 0 ? currentStock : 1;
    const newQuantity = Math.max(1, Math.min(value, maxQuantity));
    setQuantity(newQuantity);
  };

  // ✅ Decrease quantity
  const handleDecreaseQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  // ✅ Increase quantity
  const handleIncreaseQuantity = () => {
    const maxQuantity = currentStock > 0 ? currentStock : 1;
    setQuantity(Math.min(maxQuantity, quantity + 1));
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (currentStock <= 0) {
      setErrorMessage("❌ Ye product stock mein nahi hai!");
      return;
    }
    if (quantity > currentStock) {
      setErrorMessage(`❌ Sirf ${currentStock} items available hain.`);
      return;
    }
    addToCart(product, quantity);
    openCart();
    setErrorMessage("");
  };

  // ✅ Direct WhatsApp order
  const handleWhatsAppDirectOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (currentStock <= 0 || submittingDirect) return;

    setSubmittingDirect(true);

    try {
      // ✅ Database se latest stock check karo
      const productRef = doc(db, "products", product.id);
      const freshSnap = await getDoc(productRef);
      
      if (!freshSnap.exists()) {
        setErrorMessage("❌ Product database mein nahi mila!");
        setSubmittingDirect(false);
        return;
      }

      const freshStock = Number(freshSnap.data().stockCount) || 0;

      // Stock check - agar kam hai to stop karo
      if (freshStock < quantity) {
        setErrorMessage(
          `❌ Stock khatam ho gaya! Abhi sirf ${freshStock} ${product.unit || 'kg'} available hai.`
        );
        setSubmittingDirect(false);
        return;
      }

      const orderQty = Number(quantity);
      const lineTotal = discountedPrice * orderQty;

      // ✅ STEP 1: Order database mein save karo
      await addDoc(collection(db, "orders"), {
        name: "Direct WhatsApp Buyer",
        phone: "WhatsApp Contact",
        address: "Requested via Product Page",
        items: [{
          productName: product.name,
          quantity: `${orderQty} ${product.unit || 'kg'}`,
          subtotal: lineTotal
        }],
        totalBill: lineTotal,
        createdAt: serverTimestamp(),
      });

      // ✅ STEP 2: Stock ko safely minus karo
      await updateDoc(productRef, {
        stockCount: increment(-orderQty)
      });

      // ✅ STEP 3: WhatsApp open karo
      const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi DogarVision, I want to order ${orderQty} ${product.unit || 'kg'} of ${product.name}. Total: Rs. ${lineTotal}`
      )}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setErrorMessage("");
      setQuantity(1); // Reset quantity

    } catch (err) {
      console.error("Direct order error:", err);
      setErrorMessage("❌ Order processing mein error. WhatsApp par directly contact karein.");
    } finally {
      setSubmittingDirect(false);
    }
  };

  const isOutOfStock = currentStock <= 0;

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
          {product.badge && <span className="product-detail__badge">{product.badge}</span>}
          <div className="product-detail__hero-grid">
            <div>
              <p className="product-detail__label">DogarVision Specialty</p>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__desc">{product.desc}</p>
              
              <div className="product-detail__price-section">
                {product.discountPercentage > 0 && (
                  <>
                    <span className="product-detail__original-price">Rs. {baseOriginalPrice} / {product.unit}</span>
                    <span className="product-detail__discount-badge">{product.discountPercentage}% OFF</span>
                  </>
                )}
                <p className="product-detail__price">
                  Rs. {discountedPrice.toFixed(0)} / {product.unit}
                </p>
              </div>

              <div className="product-detail__stock-section">
                {isOutOfStock ? (
                  <span className="product-detail__stock-badge product-detail__stock-badge--out">
                    ❌ Out of Stock
                  </span>
                ) : (
                  <span className="product-detail__stock-badge product-detail__stock-badge--in">
                    ✅ In Stock ({currentStock} remaining)
                  </span>
                )}
              </div>

              <div className="product-detail__quantity-section">
                <label className="product-detail__quantity-label">Quantity:</label>
                <div className="product-detail__quantity-controls">
                  <button
                    type="button"
                    className="product-detail__quantity-btn"
                    onClick={handleDecreaseQuantity}
                    disabled={isOutOfStock || submittingDirect || quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="product-detail__quantity-input"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={currentStock > 0 ? currentStock : 1}
                    disabled={isOutOfStock || submittingDirect}
                    aria-label="Quantity input"
                  />
                  <button
                    type="button"
                    className="product-detail__quantity-btn"
                    onClick={handleIncreaseQuantity}
                    disabled={isOutOfStock || submittingDirect || quantity >= currentStock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "#ffebee", 
                  borderRadius: "4px", 
                  color: "#c62828",
                  marginBottom: "16px",
                  fontSize: "0.95rem"
                }}>
                  {errorMessage}
                </div>
              )}

              <div className="product-detail__actions">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || submittingDirect}
                >
                  {isOutOfStock ? "❌ Out of Stock" : "🛒 Add to Cart"}
                </Button>
                <Button 
                  type="button" 
                  variant="accent" 
                  onClick={handleWhatsAppDirectOrder} 
                  disabled={isOutOfStock || submittingDirect}
                >
                  {submittingDirect ? "⏳ Processing..." : "💬 Order via WhatsApp"}
                </Button>
                <Link to="/" className="btn btn--outline">
                  ← Back to Home
                </Link>
              </div>
            </div>
            <div className="product-detail__visual" aria-hidden="true">
              <span className="product-detail__emoji">{product.emoji}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="section product-detail__reviews">
        <div className="container">
          <h2 className="product-detail__section-title">
            Customer Reviews <span>/ Khareedar ki Raaye</span>
          </h2>
          <div className="product-detail__reviews-list">
            {loadingReviews ? (
              <p className="feedback__status">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="feedback__status" style={{ gridColumn: "1 / -1", width: "100%" }}>
                No reviews yet for this product. Be the first to share your experience on home page!
              </p>
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

      <Footer />
      <CartFab />
    </div>
  );
}
