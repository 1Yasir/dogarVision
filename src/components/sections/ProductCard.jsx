import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
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
}) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [addedFeedback, setAddedFeedback] = useState(false);

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

  const imageBlock = (
    <div
      className="position-relative text-center py-4 bg-light rounded-top"
      style={{ minHeight: "160px" }}
    >
      <Badge bg="warning" className="position-absolute top-0 start-0 m-2">
        {badgeText}
      </Badge>
      <span style={{ fontSize: "3.5rem", lineHeight: 1 }} aria-hidden="true">
        {emoji}
      </span>
      {imageLabel && (
        <span className="d-block small text-muted mt-2">{imageLabel}</span>
      )}
    </div>
  );

  const priceBlock = (
    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
      {hasDiscount ? (
        <>
          <span className="fw-bold text-success">
            {isKgProduct
              ? `${formatPrice(finalPrice)} (${selectedKg} ${unit})`
              : `${formatPrice(finalPrice)} / ${unit}`}
          </span>
          <span className="text-muted small text-decoration-line-through">
            {isKgProduct ? formatPrice(basePrice) : `${formatPrice(unitPrice)} / ${unit}`}
          </span>
          <Badge bg="danger">{discountPercentage}% OFF</Badge>
        </>
      ) : (
        <span className="fw-bold text-success">
          {isKgProduct
            ? `${formatPrice(basePrice)} (${selectedKg} ${unit})`
            : `${formatPrice(unitPrice)} / ${unit}`}
        </span>
      )}
    </div>
  );

  const bodyContent = (
    <>
      <Card.Title as="h3" className="h5">{name}</Card.Title>
      {desc && <Card.Text className="text-muted small">{desc}</Card.Text>}
      {priceBlock}
    </>
  );

  const cartButton = (
    <Button
      variant="success"
      size="sm"
      className="w-100"
      onClick={handleAddToCart}
      disabled={!isAvailable}
    >
      {addedFeedback ? productsCopy.added : productsCopy.addToCart}
    </Button>
  );

  if (path) {
    return (
      <Card className="shadow-sm h-100 border-0">
        <Link
          to={path}
          className="text-decoration-none text-body stretched-link"
          onClick={handleCardClick}
        >
          {imageBlock}
          <Card.Body>
            {bodyContent}
            <span className="small text-success">
              {isAvailable ? productsCopy.viewDetails : productsCopy.comingSoon}
            </span>
          </Card.Body>
        </Link>
        <Card.Footer className="bg-white border-0 pt-0" style={{ position: "relative", zIndex: 2 }}>
          {cartButton}
        </Card.Footer>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-100 border-0">
      {imageBlock}
      <Card.Body className="d-flex flex-column">
        {bodyContent}
        <div className="mt-auto">{cartButton}</div>
      </Card.Body>
    </Card>
  );
}