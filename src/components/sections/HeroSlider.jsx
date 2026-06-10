import { useCallback, useEffect, useState } from "react";
import { products } from "../../data/siteData";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

const slides = [
  {
    id: "poultry",
    productId: "eggs",
    badge: "Farm Fresh · Daily Delivery",
    title: "Fresh, Healthy & Premium",
    highlight: "Poultry Products",
    subtitle:
      "High-quality chicken, organic eggs, and day-old chicks raised with the highest biosecurity and hygiene standards.",
    emoji: "🐔🥚",
    theme: "hero-slider__slide--poultry",
  },
  {
    id: "achar",
    productId: "achar",
    badge: "New Launch",
    title: "100% Homemade & Premium",
    highlight: "Achar",
    subtitle:
      "Traditional family recipes, sun-ripened ingredients, and zero artificial preservatives — crafted in small batches for authentic taste.",
    emoji: "🫙🌶️",
    theme: "hero-slider__slide--achar",
  },
];

const INTERVAL_MS = 3000;
const extendedSlides = [...slides, slides[0]];

export default function HeroSlider() {
  const { addToCart } = useCart();
  const [trackIndex, setTrackIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(
    () => typeof document !== "undefined" && !document.hidden
  );

  const activeIndex = trackIndex % slides.length;

  useEffect(() => {
    const handleVisibility = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);

      if (!visible) {
        setIsPaused(true);
        return;
      }

      setTrackIndex((prev) => prev % slides.length);
      setEnableTransition(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setIsPaused(false);
        });
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (isPaused || !isTabVisible) return;

    const timer = setInterval(() => {
      setEnableTransition(true);
      setTrackIndex((prev) => prev + 1);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, isTabVisible]);

  const handleTransitionEnd = useCallback(
    (event) => {
      if (
        event.target !== event.currentTarget ||
        event.propertyName !== "transform"
      ) {
        return;
      }

      if (trackIndex === slides.length) {
        setEnableTransition(false);
        setTrackIndex(0);
      }
    },
    [trackIndex]
  );

  useEffect(() => {
    if (!enableTransition && trackIndex === 0) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [enableTransition, trackIndex]);

  const goToSlide = (index) => {
    setEnableTransition(true);
    setTrackIndex(index);
  };

  const handleOrderNow = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const quantity =
      product.unitType === "kg" ? (product.kgOptions?.[0] ?? 0.5) : 1;
    addToCart(product, quantity);
  };

  return (
    <section
      id="home"
      className={`hero-slider ${activeIndex === 1 ? "hero-slider--achar-active" : ""}`}
      aria-label="Featured banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider__viewport">
        <div
          className={`hero-slider__track ${!enableTransition ? "hero-slider__track--instant" : ""}`}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => (
            <article
              key={`${slide.id}-${index}`}
              className={`hero-slider__slide ${slide.theme}`}
              aria-hidden={index !== trackIndex}
            >
              <div className="container hero-slider__content">
                <div className="hero-slider__text">
                  <div className="hero-slider__badge">
                    <span className="hero-slider__badge-dot" />
                    {slide.badge}
                  </div>
                  <h1 className="hero-slider__title">
                    {slide.title} <span>{slide.highlight}</span>
                  </h1>
                  <p className="hero-slider__subtitle">{slide.subtitle}</p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleOrderNow(slide.productId)}
                  >
                    Order Now
                  </Button>
                </div>
                <div className="hero-slider__visual" aria-hidden="true">
                  <span className="hero-slider__emoji">{slide.emoji}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-slider__dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`hero-slider__dot ${index === activeIndex ? "hero-slider__dot--active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.highlight}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
