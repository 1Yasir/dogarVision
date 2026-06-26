import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/cartHelpers";

export default function CartFab() {
  const { itemCount, totalBill, openCart } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      className="cart-fab"
      onClick={openCart}
      aria-label="Open cart"
    >
      <span aria-hidden="true">🛒</span>
      <span className="cart-fab__badge">{itemCount}</span>
      <span className="cart-fab__total">{formatPrice(totalBill)}</span>
    </button>
  );
}