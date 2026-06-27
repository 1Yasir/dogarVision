import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { heroSlideGroups } from "../../data/heroSlides";
import { heroCopy } from "../../data/copy";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

// 1. Component ke bahar ek Default Fallback Slide data bana lein
const DEFAULT_SLIDE = {
  id: "default-fallback",
  slideType: "poultry",
  emoji: "🐔",
  badge: "Premium Quality",
  title: "Fresh & Organic",
  highlight: "Farm Products",
  subtitle: "High-quality organic farm-fresh products delivered straight to your doorstep.",
  product: {
    available: false, // Order button click handle karne ke liye safety check
    stockCount: 0,
    discountPercentage: 0
  }
};

export default function HeroSlider() {
  const [dbProducts, setDbProducts] = useState([]);
  const [current, setCurrent] = useState(0);
  const [instant, setInstant] = useState(false);
  const { addToCart, openCart } = useCart();
  const timerRef = useRef(null);

  // Zaroorat ke mutabiq images ke broken links ko fallback par dalne ke liye track state
  const [brokenImages, setBrokenImages] = useState({});

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

  // Real-time products filter karne ka logic
  const liveSlides = useMemo(() => {
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

  // 2. Agar liveSlides khali hain (loading ya stock 0), to DEFAULT_SLIDE array use karein
  const slides = liveSlides.length > 0 ? liveSlides : [DEFAULT_SLIDE];

  const goTo = useCallback(
    (index, isInstant = false) => {
      if (slides.length === 0) return;
      setInstant(isInstant);
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, slides.length, goTo]);

  const handleOrderNow = (slide) => {
    const product = slide.product;
    // Agar fallback slide hai jisme real product nahi hai, to function yahin ruk jaye
    if (!product?.id || !product?.available || (Number(product.stockCount) || 0) <= 0) return;
    
    const quantity = product.unitType === "kg" ? (product.kgOptions?.[0] ?? 0.5) : 1;
    addToCart(product, quantity);
    openCart();
  };

  const activeSlide = slides[current];
  const isAchar = activeSlide?.slideType === "achar";

  return (
    <section
      id="home"
      aria-label="Featured banners"
      className={`hero-slider${isAchar ? " hero-slider--achar-active" : ""}`}
    >
      {/* Viewport + Track */}
      <div className="hero-slider__viewport">
        <div
          className={`hero-slider__track${instant ? " hero-slider__track--instant" : ""}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => {
            const productDiscount = slide.product?.discountPercentage ?? 0;
            const hasDiscount = productDiscount > 0;
            const slideIsAchar = slide.slideType === "achar";
            
            // Firebase se image URL check karein
            const slideImageUrl = slide.product?.imageUrl; 
            const isImageBroken = brokenImages[slide.id];

            return (
              <div
                key={slide.id}
                className={`hero-slider__slide${
                  slideIsAchar
                    ? " hero-slider__slide--achar"
                    : " hero-slider__slide--poultry"
                }`}
              >
                <div className="container">
                  <div className="hero-slider__content">
                    {/* Left: Text */}
                    <div>
                      <div className="hero-slider__badge">
                        <span className="hero-slider__badge-dot" />
                        {slide.badge}
                      </div>

                      <h1 className="hero-slider__title">
                        {slide.title}{" "}
                        <span>{slide.highlight}</span>
                      </h1>

                      <p className="hero-slider__subtitle">{slide.subtitle}</p>

                      {/* Agar default fallback slide ho, to Order Now button hide kar sakte hain ya disabled */}
                      {slide.id !== "default-fallback" && (
                        <button
                          className="btn btn--primary"
                          onClick={() => handleOrderNow(slide)}
                        >
                          {heroCopy.orderNow}
                        </button>
                      )}
                    </div>

                    {/* Right: Visual */}
                    <div className="hero-slider__visual">
                      {hasDiscount && (
                        <span className="hero-slider__discount-tag" style={{ zIndex: 10 }}>
                          {productDiscount}% OFF
                        </span>
                      )}

                      {/* Naya Image rendering check fallback system ke sath */}
                      {slideImageUrl && !isImageBroken ? (
                        <img
                          src={slideImageUrl}
                          alt={slide.title}
                          className="hero-slider__img"
                          onError={() => {
                            setBrokenImages(prev => ({ ...prev, [slide.id]: true }));
                          }}
                        />
                      ) : (
                        /* Purana Emoji Fallback */
                        <span
                          className="hero-slider__emoji"
                          aria-hidden="true"
                        >
                          {slide.emoji}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="hero-slider__dots" role="tablist" aria-label="Slides">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={`hero-slider__dot${
                i === current ? " hero-slider__dot--active" : ""
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}