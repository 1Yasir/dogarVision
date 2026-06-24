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
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
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

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <div className="bg-body min-vh-100 d-flex flex-column min-vh-100 d-flex flex-column">
        <NavBar />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <p className="text-muted">Loading product details...</p>
        </Container>
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

  const handleDecreaseQuantity = () => {
    applyQuantity(quantity - step);
  };

  const handleIncreaseQuantity = () => {
    applyQuantity(quantity + step);
  };

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
    <div className="bg-body min-vh-100 d-flex flex-column">
      <SeoHelmet
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        type="product"
      />
      <NavBar />

      <Container className="py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: product.name, to: `/product/${productId}` },
          ]}
        />

        <Card className="shadow-sm border-0 mb-5">
          <Card.Body className="p-4">
            <Row className="g-4 align-items-center">
              <Col lg={7}>
                {product.badge && (
                  <Badge bg="warning" className="mb-2">{product.badge}</Badge>
                )}
                <p className="text-muted small mb-1">DogarVision Specialty</p>
                <h1 className="h2 fw-bold mb-2">{product.name}</h1>
                <p className="text-muted mb-3">{product.desc}</p>

                <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-muted text-decoration-line-through">
                        Rs. {baseOriginalPrice} / {product.unit}
                      </span>
                      <Badge bg="danger">{product.discountPercentage}% OFF</Badge>
                    </>
                  )}
                  <span className="fs-4 fw-bold text-success">
                    Rs. {discountedPrice.toFixed(0)} / {product.unit}
                  </span>
                </div>

                <div className="mb-3">
                  {isOutOfStock ? (
                    <Badge bg="secondary">Out of Stock</Badge>
                  ) : (
                    <Badge bg="success">In Stock ({currentStock} remaining)</Badge>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup style={{ maxWidth: "200px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={handleDecreaseQuantity}
                      disabled={isOutOfStock || submittingDirect || quantity <= step}
                      aria-label="Decrease quantity"
                    >
                      −
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min={step}
                      max={currentStock > 0 ? currentStock : step}
                      step={step}
                      disabled={isOutOfStock || submittingDirect}
                      aria-label="Quantity input"
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={handleIncreaseQuantity}
                      disabled={
                        isOutOfStock ||
                        submittingDirect ||
                        quantity >= currentStock
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                  </InputGroup>
                </Form.Group>

                {errorMessage && (
                  <Alert variant="danger" className="mb-3">{errorMessage}</Alert>
                )}

                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="success"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || submittingDirect}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="warning"
                    onClick={handleWhatsAppDirectOrder}
                    disabled={isOutOfStock || submittingDirect}
                  >
                    {submittingDirect ? "Processing..." : "Order via WhatsApp"}
                  </Button>
                  <Button as={Link} to="/" variant="outline-secondary">
                    Back to Home
                  </Button>
                </div>
              </Col>

              <Col lg={5} className="text-center">
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center py-5"
                  aria-hidden="true"
                >
                  <span style={{ fontSize: "6rem" }}>{product.emoji}</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <section>
          <h2 className="h4 mb-4">Customer Reviews</h2>
          {loadingReviews ? (
            <p className="text-muted">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted">
              No reviews yet for this product. Be the first to share your experience on the home page!
            </p>
          ) : (
            <Row className="g-3">
              {reviews.map((review) => (
                <Col key={review.id} sm={6} lg={4}>
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title as="h3" className="h6 mb-0">
                          {review.name}
                        </Card.Title>
                        <span className="small text-warning">
                          {Array(review.rating).fill("★").join("")}
                        </span>
                      </div>
                      <Card.Text className="small text-muted">
                        {review.comment}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </Container>

      <Footer />
      <CartFab />
    </div>
  );
}
