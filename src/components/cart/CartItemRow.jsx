import { cartCopy } from "../../data/copy.js";
import { formatPrice } from "../../utils/cartHelpers";

export default function CartItemRow({ item, onUpdate, onSetQuantity, onRemove }) {
  const lineTotal = item.unitPrice * item.quantity;
  const maxStock = item.stockCount ?? 0;
  const minQty = item.minQty ?? 1;
  const step = item.step ?? 1;

  const handleQuantityChange = (e) => {
    const raw = e.target.value;
    if (raw === "") return;
    const value = item.unitType === "kg" ? parseFloat(raw) : parseInt(raw, 10);
    if (!Number.isNaN(value)) {
      onSetQuantity(value);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item__emoji" aria-hidden="true">{item.emoji}</div>

      <div className="cart-item__info">
        <div className="cart-item__name">{item.name}</div>
        <div className="cart-item__unit-price">
          {formatPrice(item.unitPrice)} / {item.unit}
        </div>

        <div className="cart-item__qty-row">
          <div className="cart-item__qty-controls">
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onUpdate(-step)}
              disabled={item.quantity <= minQty}
              aria-label={`${cartCopy.decrease} ${item.name}`}
            >
              −
            </button>
            <input
              type="number"
              className="cart-item__qty-input"
              value={item.quantity}
              onChange={handleQuantityChange}
              min={minQty}
              max={maxStock}
              step={step}
              aria-label={`${cartCopy.quantity} ${item.name}`}
            />
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onUpdate(step)}
              disabled={item.quantity >= maxStock}
              aria-label={`${cartCopy.increase} ${item.name}`}
            >
              +
            </button>
          </div>

          <span className="cart-item__line-total">{formatPrice(lineTotal)}</span>
        </div>

        <p className="cart-item__unit-price" style={{ marginTop: "6px", marginBottom: 0 }}>
          Available: {maxStock} {item.unit}
        </p>
      </div>

      <button
        type="button"
        className="cart-item__remove"
        onClick={onRemove}
        aria-label={`${cartCopy.remove} ${item.name}`}
      >
        ✕
      </button>
    </div>
  );
}