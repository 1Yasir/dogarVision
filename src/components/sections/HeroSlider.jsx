import { useCallback, useEffect, useMemo, useState } from "react";
import { products } from "../../data/siteData"; 
import { heroSlideGroups } from "../../data/heroSlides";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../common/Button";

const INTERVAL_MS = 3000;

export default function HeroSlider() {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage(); 

  const isRTL = lang === "ur";

  const slides = useMemo(() => {
    return heroSlideGroups
      .map((group) => {
        const availableProduct = products.find(
          (p) => group.categories.includes(p.category) && p.available && p.stockCount > 0
        );

        if (!availableProduct) return null;

        const copy = t(`hero.slides.${group.translationKey}`);

        const defaultContent = {
          achar: {
            badge: "100% Homemade",
            title: "Traditional Homemade",
            highlight: "Achar",
            subtitle: "Authentic taste made with organic oils and handpicked spices."
          },
          poultry: {
            badge: "Farm Fresh",
            title: "Fresh & Organic",
            highlight: "Poultry Products",
            subtitle: "High-quality chicken and organic eggs direct from our farm."
          }
        };

        const fallback = defaultContent[group.id] || defaultContent["poultry"];

        return {
          ...group,
          badge: copy?.badge || fallback.badge,
          title: copy?.title || fallback.title,
          highlight: copy?.highlight || fallback.highlight,
          subtitle: copy?.subtitle || fallback.subtitle,
          product: availableProduct,
        };
      })
      .filter((slide) => slide !== null); 
  }, [t]);

  const slideCount = slides.length;
  const extendedSlides = slideCount > 1 ? [...slides, slides[0]] : slides;

  const [trackIndex, setTrackIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(
    () => typeof document !== "undefined" && !document.hidden
  );

  const activeIndex = slideCount > 0 ? trackIndex % slideCount : 0;
  const isAcharActive = slides[activeIndex]?.id === "achar";

  useEffect(() => {
    setTrackIndex(0);
    setEnableTransition(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnableTransition(true));
    });
  }, [slideCount]);

  useEffect(() => {
    const handleVisibility = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);

      if (!visible) {
        setIsPaused(true);
        return;
      }

      if (slideCount > 0) {
        setTrackIndex((prev) => prev % slideCount);
      }
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
  }, [slideCount]);

  useEffect(() => {
    if (isPaused || !isTabVisible || slideCount <= 1) return;

    const timer = setInterval(() => {
      setEnableTransition(true);
      setTrackIndex((prev) => prev + 1);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, isTabVisible, slideCount]);

  const handleTransitionEnd = useCallback(
    (event) => {
      if (
        event.target !== event.currentTarget ||
        event.propertyName !== "transform" ||
        slideCount <= 1
      ) {
        return;
      }

      if (trackIndex === slideCount) {
        setEnableTransition(false);
        setTrackIndex(0);
      }
    },
    [trackIndex, slideCount]
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

  const handleOrderNow = (currentSlide) => {
    const product = currentSlide.product;
    if (!product || !product.available || product.stockCount === 0) return;
    
    const quantity = product.unitType === "kg" ? (product.kgOptions?.[0] ?? 0.5) : 1;
    addToCart(product, quantity);
  };

  if (slideCount === 0) {
    return (
      <section id="home" className="hero-slider" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
        <div className="container" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "#666", fontSize: "1.2rem" }}>Loading Fresh Products...</p>
        </div>
      </section>
    );
  }

  const translateValue = -(trackIndex * 100);

  return (
    <section
      id="home"
      className={`hero-slider ${isAcharActive ? "hero-slider--achar-active" : ""}`}
      aria-label="Featured banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider__viewport">
        <div
          className={`hero-slider__track ${!enableTransition ? "hero-slider__track--instant" : ""}`}
          style={{ transform: `translateX(${translateValue}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => {
            // 🟢 AUTOMATIC DISCOUNT CHECK: Slide ke linked product se direct data check ho raha hai
            const productDiscount = slide.product?.discountPercentage ?? 0;
            const hasDiscount = productDiscount > 0;

            return (
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
                    
                    {/* Actions container built with flex layout to handle elements in one row */}
                    <div className="hero-slider__actions" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleOrderNow(slide)}
                      >
                        {t("hero.orderNow") || "Order Now"}
                      </Button>

                    </div>
                  </div>
                  <div className="hero-slider__visual" aria-hidden="true">
                    {hasDiscount && (
                        <span 
                          className="hero-slider__discount-tag" 
                         >
                          🔥 {productDiscount}% OFF
                        </span>
                      )}
                    <span className="hero-slider__emoji">{slide.emoji}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {slideCount > 1 && (
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
      )}
    </section>
  );
}