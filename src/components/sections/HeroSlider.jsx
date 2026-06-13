import { useCallback, useEffect, useMemo, useState } from "react";
import { products } from "../../data/siteData";
import { heroSlideGroups } from "../../data/heroSlides";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../common/Button";

const INTERVAL_MS = 3000;

export default function HeroSlider() {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const slides = useMemo(() => {
    return heroSlideGroups
      .filter((group) =>
        products.some(
          (p) => group.categories.includes(p.category) && p.available
        )
      )
      .map((group) => {
        const product = products.find((p) => p.id === group.productId);
        const copy = t(`hero.slides.${group.translationKey}`);
        return {
          ...group,
          badge: copy.badge,
          title: copy.title,
          highlight: copy.highlight,
          subtitle: copy.subtitle,
          product,
        };
      });
  }, [t]);

  const slideCount = slides.length;
  const extendedSlides =
    slideCount > 1 ? [...slides, slides[0]] : slides.length ? slides : [];

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

  const handleOrderNow = (product) => {
    if (!product?.available) return;

    const quantity =
      product.unitType === "kg" ? (product.kgOptions?.[0] ?? 0.5) : 1;
    addToCart(product, quantity);
  };

  if (slideCount === 0) return null;

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
                    onClick={() => handleOrderNow(slide.product)}
                  >
                    {t("hero.orderNow")}
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
