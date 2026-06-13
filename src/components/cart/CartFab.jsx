import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/cartHelpers";

export default function CartFab() {
  const { itemCount, totalBill, openCart } = useCart();

  return (
    <button 
      type="button"
      className="cart-fab" 
      aria-label="Open cart"
      onClick={openCart}
    >
      <span className="cart-fab__icon">🛒</span>
      {itemCount > 0 && (
        <span className="cart-fab__badge">{itemCount}</span>
      )}
      {itemCount > 0 && (
        <span className="cart-fab__total">{formatPrice(totalBill)}</span>
      )}
    </button>
  );
}
