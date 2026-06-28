import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { cartCopy } from "../../data/copy.js";
import { formatPrice } from "../../utils/cartHelpers";
import CartItemRow from "./CartItemRow";
import { useCartCheckout } from "./useCartCheckout";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    setItemQuantity,
    removeFromCart,
    clearCart,
    totalBill,
    isCartOpen,
    closeCart,
  } = useCart();

  const {
    checkout,
    handleChange,
    phoneInvalid,
    canPlaceOrder,
    submitting,
    errorMessage,
    handlePlaceOrder,
    phoneError,
    idPrefix,
  } = useCartCheckout({ onOrderSuccess: closeCart, idPrefix: "drawer" });

  const itemLabel = items.length === 1 ? cartCopy.item : cartCopy.items;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="admin-modal-backdrop"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label={cartCopy.title} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">{cartCopy.title}</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty__icon" aria-hidden="true">🛒</span>
              <h3 className="cart-empty__title">{cartCopy.emptyTitle}</h3>
              <p className="cart-empty__desc">{cartCopy.emptyDesc}</p>
              <Link
                to={{ pathname: "/", hash: "#products" }}
                className="btn btn--primary btn--sm"
                onClick={closeCart}
              >
                {cartCopy.shopProducts}
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onUpdate={(delta) => updateQuantity(item.productId, delta)}
                    onSetQuantity={(value) => setItemQuantity(item.productId, value)}
                    onRemove={() => removeFromCart(item.productId)}
                  />
                ))}
              </div>

              {/* Bill Summary */}
              <div className="cart-bill">
                <div className="cart-bill__row">
                  <span>{cartCopy.subtotal} ({items.length} {itemLabel})</span>
                  <span>{formatPrice(totalBill)}</span>
                </div>
                {/* <div className="cart-bill__row cart-bill__row--delivery">
                  <span>{cartCopy.delivery}</span>
                  <span className="cart-bill__free">{cartCopy.deliveryPending}</span>
                </div> */}
                <div className="cart-bill__total">
                  <span>{cartCopy.totalBill}</span>
                  <span className="cart-bill__total-amount">{formatPrice(totalBill)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="cart-checkout">
                {/* <h3 className="cart-checkout__title">{cartCopy.checkoutTitle}</h3> */}

                {errorMessage && (
                  <div className="form-error" style={{ marginBottom: "16px" }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`${idPrefix}-name`}>
                      {cartCopy.fullName}
                    </label>
                    <input
                      id={`${idPrefix}-name`}
                      name="fullName"
                      type="text"
                      className="form-input"
                      required
                      placeholder={cartCopy.fullNamePlaceholder}
                      value={checkout.fullName}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`${idPrefix}-phone`}>
                      {cartCopy.phone}
                    </label>
                    <input
                      id={`${idPrefix}-phone`}
                      name="phone"
                      type="tel"
                      className={`form-input${phoneInvalid ? " form-input--error" : ""}`}
                      required
                      placeholder={cartCopy.phonePlaceholder}
                      value={checkout.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                    {phoneInvalid && (
                      <div className="form-error">{phoneError}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`${idPrefix}-address`}>
                      {cartCopy.address}
                    </label>
                    <textarea
                      id={`${idPrefix}-address`}
                      name="address"
                      className="form-textarea"
                      required
                      rows={3}
                      placeholder={cartCopy.addressPlaceholder}
                      value={checkout.address}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>

                  <div className="cart-checkout__actions">
                    <button
                      type="submit"
                      className="btn btn--primary cart-checkout__submit"
                      disabled={!canPlaceOrder}
                    >
                      {submitting ? cartCopy.saving : cartCopy.placeOrder}
                    </button>
                    <button
                      type="button"
                      className="cart-checkout__clear"
                      onClick={clearCart}
                      disabled={submitting}
                    >
                      {cartCopy.clearCart}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}