import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../common/Button";

function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export default function ProductCard({
  id,
  price,
  detailPath,
  unitPrice,
  unit,
  unitType,
  kgOptions = [],
  emoji,
  available = true,
  discountPercentage = 0,
}) {
  const { addToCart, openCart } = useCart();
  const { t } = useLanguage();
  const [selectedKg] = useState(kgOptions[0] ?? 1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const itemCopy = t(`products.items.${id}`);
  
  const name = itemCopy.name;
  const desc = itemCopy.desc;
  const badge = available ? itemCopy.badge : t("products.comingSoon");
  const imageLabel = itemCopy.imageLabel;

  // 🟢 NEW GLOBAL LOGIC: Yeh har unit par kaam karegi (kg, unit, liter, crate)
  const hasDiscount = discountPercentage > 0;
  const isKgProduct = unitType === "kg";
  
  // Base Price hamesha number wale 'unitPrice' se calculate hogi. 
  // Agar kg wala product hai toh select kiye gaye weight se multiply hoga, nahi toh 1 se multiply hoga (jaise eggs, milk, chicken)
  const multiplier = isKgProduct ? selectedKg : 1;
  const basePrice = unitPrice * multiplier;
  
  // Final discounted price calculation
  const finalPrice = hasDiscount 
    ? basePrice - (basePrice * discountPercentage) / 100 
    : basePrice;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available) return;

    const quantity = isKgProduct ? selectedKg : 1;
    addToCart({ id, name, emoji, unitPrice, unit, unitType }, quantity);
    openCart();
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleCardClick = (e) => {
    if (!available) {
      e.preventDefault();
      alert(`Maazrat! ${name} abhi dastayab nahi hai. Yeh jald hi un-qarib lounch ki jaye gi.`);
    }
  };

  const cartControls = (
    <div className="product-card__cart-controls">
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleAddToCart}
        disabled={!available}
        className={addedFeedback ? "product-card__add-btn--added" : ""}
      >
        {addedFeedback ? t("products.added") : t("products.addToCart")}
      </Button>
    </div>
  );

  const imageBlock = (
    <div className="product-card__image">
      <span
        className={`product-card__badge${!available ? " product-card__badge--unavailable" : ""}`}
      >
        {badge}
      </span>
      <span className="product-card__emoji">{emoji}</span>
      <span className="product-card__image-label">{imageLabel}</span>
    </div>
  );

  // 🟢 DYNAMIC DISPLAY BLOCK: Pura price layout bina error ke dunya ke har unit par fit baithega
  const bodyBlock = (
    <>
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__desc">{desc}</p>
      
      <div className="product-card__price-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", margin: "6px 0" }}>
        {hasDiscount ? (
          <>
            {/* New Discounted Price */}
            <p className="product-card__price" style={{ margin: 0, fontWeight: "bold" }}>
              {isKgProduct ? `${formatPrice(finalPrice)} (${selectedKg} ${unit})` : `${formatPrice(finalPrice)} / ${unit}`}
            </p>
            {/* Old Price (Crossed out) */}
            <span className="product-card__old-price" style={{ textDecoration: "line-through", color: "#888", fontSize: "0.85rem" }}>
              {isKgProduct ? formatPrice(basePrice) : `${formatPrice(unitPrice)} / ${unit}`}
            </span>
            {/* Discount Percentage Tag */}
            <span className="product-card__discount-badge" style={{ backgroundColor: "#e11d48", color: "#fff", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
              {discountPercentage}% OFF
            </span>
          </>
        ) : (
          /* Normal Price if no discount */
          <p className="product-card__price" style={{ margin: 0 }}>
            {isKgProduct ? `${formatPrice(basePrice)} (${selectedKg} ${unit})` : `${formatPrice(unitPrice)} / ${unit}`}
          </p>
        )}
      </div>
    </>
  );

  const cardClass = `product-card${!available ? " product-card--unavailable" : ""}${detailPath ? " product-card--has-detail" : ""}`;

  if (detailPath) {
    return (
      <article className={cardClass}>
        <Link to={detailPath} className="product-card__detail-link" onClick={handleCardClick}>
          {imageBlock}
          <div className="product-card__body product-card__body--linked">
            {bodyBlock}
            <span className="product-card__view-detail">
              {available ? t("products.viewDetails") : t("products.comingSoon")}
            </span>
          </div>
        </Link>
        <div className="product-card__footer">{cartControls}</div>
      </article>
    );
  }

  return (
    <div className={cardClass}>
      {imageBlock}
      <div className="product-card__body">
        {bodyBlock}
        {cartControls}
      </div>
    </div>
  );
}