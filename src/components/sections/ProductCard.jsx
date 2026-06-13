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
}) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedKg] = useState(kgOptions[0] ?? 1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const itemCopy = t(`products.items.${id}`);
  const name = itemCopy.name;
  const desc = itemCopy.desc;
  const badge = available ? itemCopy.badge : t("products.comingSoon");
  const imageLabel = itemCopy.imageLabel;

  const isKgProduct = unitType === "kg";
  const displayPrice = isKgProduct
    ? `${formatPrice(unitPrice * selectedKg)} (${selectedKg} kg)`
    : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available) return;

    const quantity = isKgProduct ? selectedKg : 1;
    addToCart({ id, name, emoji, unitPrice, unit, unitType }, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
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

  const bodyBlock = (
    <>
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__desc">{desc}</p>
      <p className="product-card__price">{displayPrice}</p>
    </>
  );

  const cardClass = `product-card${!available ? " product-card--unavailable" : ""}${detailPath ? " product-card--has-detail" : ""}`;

  if (detailPath) {
    return (
      <article className={cardClass}>
        <Link to={detailPath} className="product-card__detail-link">
          {imageBlock}
          <div className="product-card__body product-card__body--linked">
            {bodyBlock}
            <span className="product-card__view-detail">{t("products.viewDetails")}</span>
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
