import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { productsCopy } from "../../data/copy";
import { clampQuantity, roundQuantity, STOCK_MAX_MESSAGE } from "../../utils/stockValidation";
import { useToast } from "../../context/ToastContext";

function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

export default function ProductCard({
  id,
  name,
  desc,
  badge: productBadge,
  imageLabel,
  emoji,
  unitPrice,
  unit,
  unitType,
  kgOptions = [],
  available = true,
  discountPercentage = 0,
  stockCount = 0,
  detailPath,
  imageUrl, // ◄ 1. Node script se jo naya field aya wo yahan receive kiya
}) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imageError, setImageError] = useState(false); // ◄ 2. Image error state track karne ke liye

  const stock = Math.max(0, Number(stockCount) || 0);
  const isAvailable = available && stock > 0;
  const badgeText = isAvailable
    ? productBadge || productsCopy.filters.all
    : productsCopy.comingSoon;
  const path = detailPath || (id ? `/product/${id}` : null);

  const hasDiscount = Number(discountPercentage) > 0;
  const isKgProduct = unitType === "kg";
  const selectedKg = kgOptions[0] ?? 0.5;
  const multiplier = isKgProduct ? selectedKg : 1;
  const basePrice = Number(unitPrice) * multiplier;
  const finalPrice = hasDiscount
    ? basePrice - (basePrice * discountPercentage) / 100
    : basePrice;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    const quantity = isKgProduct ? selectedKg : 1;
    const rounded = roundQuantity(quantity, unitType ?? "unit");
    const { value, hitMax } = clampQuantity(rounded, stock);
    if (hitMax) showToast(STOCK_MAX_MESSAGE, "warning");

    addToCart(
      {
        id,
        name,
        emoji,
        unitPrice,
        unit,
        unitType,
        stockCount: stock,
        discountPercentage,
        imageUrl, // ◄ Cart me bhi image pass kar di taake wahan bhi dikhe
      },
      value
    );
    openCart();
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleCardClick = (e) => {
    if (!isAvailable) {
      e.preventDefault();
      alert(productsCopy.unavailableAlert(name));
    }
  };

  /* ── 3. Image Block Modified ── */
  const imageBlock = (
    <div className="product-card__image" style={{ position: "relative", overflow: "hidden" }}>
      <span
        className={`product-card__badge${!isAvailable ? " product-card__badge--unavailable" : ""}`}
      >
        {badgeText}
      </span>

      {/* Agar database me imageUrl hai aur image load hone me koi error nahi aya */}
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name}
          className="product-card__img"
          onError={() => setImageError(true)} // ◄ Agar folder me file na ho, to auto emoji par shift ho jaye
        />
      ) : (
        /* Fallback: Agar picture missing hai ya load nahi hui, to purana emoji dikhaye */
        <span className="product-card__emoji" aria-hidden="true">
          {emoji}
        </span>
      )}

      {imageLabel && (
        <span className="product-card__image-label">{imageLabel}</span>
      )}
    </div>
  );

  /* ── Price Block ── */
  const priceBlock = (
    <div className="product-card__price">
      {hasDiscount ? (
        <>
          <span>
            {isKgProduct
              ? `${formatPrice(finalPrice)} (${selectedKg} ${unit})`
              : `${formatPrice(finalPrice)} / ${unit}`}
          </span>
          <span
            style={{
              color: "var(--text-muted)",
              textDecoration: "line-through",
              fontSize: "0.875rem",
              marginLeft: "8px",
              fontWeight: 500,
            }}
          >
            {isKgProduct ? formatPrice(basePrice) : `${formatPrice(unitPrice)} / ${unit}`}
          </span>
          <span
            style={{
              background: "#ef4444",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "12px",
              marginLeft: "6px",
            }}
          >
            {discountPercentage}% OFF
          </span>
        </>
      ) : (
        <span>
          {isKgProduct
            ? `${formatPrice(basePrice)} (${selectedKg} ${unit})`
            : `${formatPrice(unitPrice)} / ${unit}`}
        </span>
      )}
    </div>
  );

  /* ── Body Content ── */
  const bodyContent = (
    <>
      <h3 className="product-card__name">{name}</h3>
      {desc && <p className="product-card__desc">{desc}</p>}
      {priceBlock}
    </>
  );

  /* ── Add to Cart Button ── */
  const cartButton = (
    <button
      className={`btn btn--primary btn--sm w-100${addedFeedback ? " product-card__add-btn--added" : ""}`}
      onClick={handleAddToCart}
      disabled={!isAvailable}
      style={{ width: "100%" }}
    >
      {addedFeedback ? productsCopy.added : productsCopy.addToCart}
    </button>
  );

  /* ── With Detail Link ── */
  if (path) {
    return (
      <div className={`product-card product-card--has-detail${!isAvailable ? " product-card--unavailable" : ""}`}>
        <Link
          to={path}
          className="product-card__detail-link"
          onClick={handleCardClick}
        >
          {imageBlock}
          <div className="product-card__body product-card__body--linked">
            {bodyContent}
            <span className="product-card__view-detail">
              {isAvailable ? productsCopy.viewDetails : productsCopy.comingSoon}
            </span>
          </div>
        </Link>
        <div className="product-card__footer">
          {cartButton}
        </div>
      </div>
    );
  }

  /* ── Without Detail Link ── */
  return (
    <div className={`product-card${!isAvailable ? " product-card--unavailable" : ""}`}>
      {imageBlock}
      <div className="product-card__body">
        {bodyContent}
        <div style={{ marginTop: "auto" }}>{cartButton}</div>
      </div>
    </div>
  );
}