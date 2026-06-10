import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/cartHelpers";

export default function CartFab() {
  const { itemCount, totalBill } = useCart();

  return (
    <Link to="/cart" className="cart-fab" aria-label="Go to cart">
      <span className="cart-fab__icon">🛒</span>
      {itemCount > 0 && (
        <span className="cart-fab__badge">{itemCount}</span>
      )}
      {itemCount > 0 && (
        <span className="cart-fab__total">{formatPrice(totalBill)}</span>
      )}
    </Link>
  );
}
