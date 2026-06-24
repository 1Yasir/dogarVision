import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
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
    <Card className="mb-3">
      <Card.Body className="d-flex gap-3 align-items-start">
        <div className="fs-3 lh-1" aria-hidden="true">{item.emoji}</div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <Card.Title as="h6" className="mb-1">{item.name}</Card.Title>
              <Card.Subtitle className="text-muted small mb-2">
                {formatPrice(item.unitPrice)} / {item.unit}
              </Card.Subtitle>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-danger p-0"
              onClick={onRemove}
              aria-label={`${cartCopy.remove} ${item.name}`}
            >
              ✕
            </Button>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <ButtonGroup size="sm">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => onUpdate(-step)}
                disabled={item.quantity <= minQty}
                aria-label={`${cartCopy.decrease} ${item.name}`}
              >
                −
              </Button>
              <Form.Control
                type="number"
                size="sm"
                className="text-center"
                style={{ width: "4.5rem" }}
                value={item.quantity}
                onChange={handleQuantityChange}
                min={minQty}
                max={maxStock}
                step={step}
                aria-label={`${cartCopy.quantity} ${item.name}`}
              />
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => onUpdate(step)}
                disabled={item.quantity >= maxStock}
                aria-label={`${cartCopy.increase} ${item.name}`}
              >
                +
              </Button>
            </ButtonGroup>
            <span className="fw-semibold">{formatPrice(lineTotal)}</span>
          </div>

          <p className="text-muted small mt-2 mb-0">
            Available: {maxStock} {item.unit}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}