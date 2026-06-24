import { useEffect, useMemo, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { heroSlideGroups } from "../../data/heroSlides";
import { heroCopy } from "../../data/copy";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function HeroSlider() {
  const [dbProducts, setDbProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        }));
        setDbProducts(fetched);
      },
      (error) => {
        console.error("Error loading hero products:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const slides = useMemo(() => {
    return heroSlideGroups
      .map((group) => {
        const availableProduct = dbProducts.find(
          (p) =>
            group.categories.includes(p.category) &&
            p.available &&
            (Number(p.stockCount) || 0) > 0
        );
        if (!availableProduct) return null;

        const copy = heroCopy.slides[group.translationKey] || {};
        return {
          ...group,
          badge: copy.badge,
          title: copy.title,
          highlight: copy.highlight,
          subtitle: copy.subtitle,
          product: availableProduct,
        };
      })
      .filter(Boolean);
  }, [dbProducts]);

  const handleOrderNow = (slide) => {
    const product = slide.product;
    if (!product?.available || (Number(product.stockCount) || 0) <= 0) return;
    const quantity =
      product.unitType === "kg" ? (product.kgOptions?.[0] ?? 0.5) : 1;
    addToCart(product, quantity);
  };

  if (slides.length === 0) {
    return (
      <section id="home" className="py-5 bg-light">
        <Container className="text-center">
          <p className="text-muted">{heroCopy.loading}</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="home" aria-label="Featured banners">
      <Carousel>
        {slides.map((slide) => {
          const productDiscount = slide.product?.discountPercentage ?? 0;
          const hasDiscount = productDiscount > 0;

          return (
            <Carousel.Item key={slide.id}>
              <div className="bg-light py-5">
                <Container>
                  <Row className="align-items-center g-4">
                    <Col md={7}>
                      <Badge bg="success" className="mb-3">
                        {slide.badge}
                      </Badge>
                      <h1 className="display-5 fw-bold mb-3">
                        {slide.title}{" "}
                        <span className="text-success">{slide.highlight}</span>
                      </h1>
                      <p className="lead text-muted mb-4">{slide.subtitle}</p>
                      <Button
                        variant="success"
                        size="lg"
                        onClick={() => handleOrderNow(slide)}
                      >
                        {heroCopy.orderNow}
                      </Button>
                    </Col>
                    <Col md={5} className="text-center position-relative">
                      {hasDiscount && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 end-0 m-2"
                        >
                          {productDiscount}% OFF
                        </Badge>
                      )}
                      <span style={{ fontSize: "5rem" }} aria-hidden="true">
                        {slide.emoji}
                      </span>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </section>
  );
}