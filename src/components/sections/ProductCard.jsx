import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export default function ProductCard({
  id,
  name,
  desc,
  price,
  badge,
  imageLabel,
  emoji,
  detailPath,
  unitPrice,
  unit,
  unitType,
  kgOptions = [],
}) {
  const { addToCart } = useCart();
  const [selectedKg, setSelectedKg] = useState(kgOptions[0] ?? 1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const isKgProduct = unitType === "kg";
  const displayPrice = isKgProduct
    ? `${formatPrice(unitPrice * selectedKg)} (${selectedKg} kg)`
    : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const quantity = isKgProduct ? selectedKg : 1;
    addToCart(
      { id, name, emoji, unitPrice, unit, unitType },
      quantity
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const cartControls = (
    <div className="product-card__cart-controls">

      {/* {isKgProduct && (
        <div className="product-card__kg-select">
          <label className="product-card__kg-label" htmlFor={`kg-${id}`}>
            Select Quantity (KG)
          </label>
          <select
            id={`kg-${id}`}
            className="product-card__kg-dropdown"
            value={selectedKg}
            onChange={(e) => setSelectedKg(Number(e.target.value))}
            onClick={(e) => e.stopPropagation()}
          >
            {kgOptions.map((kg) => (
              <option key={kg} value={kg}>
                {kg} kg — {formatPrice(unitPrice * kg)}
              </option>
            ))}
          </select>
        </div>
      )} */}
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleAddToCart}
        className={addedFeedback ? "product-card__add-btn--added" : ""}
      >
        {addedFeedback ? "✓ Added!" : "Add to Cart"}
      </Button>
    </div>
  );

  const imageBlock = (
    <div className="product-card__image">
      <span className="product-card__badge">{badge}</span>
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

  if (detailPath) {
    return (
      <article className="product-card product-card--has-detail">
        <Link to={detailPath} className="product-card__detail-link">
          {imageBlock}
          <div className="product-card__body product-card__body--linked">
            {bodyBlock}
            <span className="product-card__view-detail">View Details →</span>
          </div>
        </Link>
        <div className="product-card__footer">{cartControls}</div>
      </article>
    );
  }

  return (
    <div className="product-card">
      {imageBlock}
      <div className="product-card__body">
        {bodyBlock}
        {cartControls}
      </div>
    </div>
  );
}
