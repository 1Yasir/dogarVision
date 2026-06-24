import { Button, Badge } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/cartHelpers";

export default function CartFab() {
  const { itemCount, totalBill, openCart } = useCart();

  return (
    <Button
      type="button"
      variant="primary"
      className="position-fixed end-0 m-3 rounded-pill shadow d-flex align-items-center gap-2"
      style={{ bottom: "5.5rem", zIndex: 1040 }}
      onClick={openCart}
      aria-label="Open cart"
    >
      <span aria-hidden="true">🛒</span>
      {itemCount > 0 && (
        <Badge bg="danger" pill>{itemCount}</Badge>
      )}
      {itemCount > 0 && (
        <span className="small">{formatPrice(totalBill)}</span>
      )}
    </Button>
  );
}