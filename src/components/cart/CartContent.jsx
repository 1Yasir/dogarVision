import { useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { contactInfo, products } from "../../data/siteData";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../firebase";
import {
  formatPrice,
  formatQuantity,
  buildWhatsAppMessage,
} from "../../utils/cartHelpers";
import {
  sanitizePhoneInput,
  isValidPakistaniPhone,
  PAKISTANI_PHONE_ERROR,
} from "../../utils/phoneValidation";
import Button from "../common/Button";

const initialCheckout = {
  fullName: "",
  phone: "",
  address: "",
};

function CartItemRow({ item, onUpdate, onRemove, t }) {
  const product = products.find((p) => p.id === item.productId);
  const hasDiscount = product && product.discountPercentage > 0;
  const finalUnitPrice = hasDiscount 
    ? item.unitPrice * (1 - product.discountPercentage / 100) 
    : item.unitPrice;

  const lineTotal = finalUnitPrice * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item__emoji">{item.emoji}</div>
      <div className="cart-item__info">
        <h4 className="cart-item__name">{item.name}</h4>
        <p className="cart-item__unit-price">
          {hasDiscount ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
                {formatPrice(item.unitPrice)}
              </span>
              <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                {formatPrice(finalUnitPrice)}
              </span>
            </>
          ) : (
            formatPrice(item.unitPrice)
          )} / {item.unit}
        </p>
        <div className="cart-item__qty-row">
          <div className="cart-item__qty-controls">
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onUpdate(item.productId, -1)}
              aria-label={`${t("cart.decrease")} ${item.name}`}
            >
              −
            </button>
            <span className="cart-item__qty-value">
              {formatQuantity(item)}
            </span>
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onUpdate(item.productId, 1)}
              aria-label={`${t("cart.increase")} ${item.name}`}
            >
              +
            </button>
          </div>
          <span className="cart-item__line-total">{formatPrice(lineTotal)}</span>
        </div>
      </div>
      <button
        type="button"
        className="cart-item__remove"
        onClick={() => onRemove(item.productId)}
        aria-label={`${t("cart.remove")} ${item.name}`}
      >
        ✕
      </button>
    </div>
  );
}

export default function CartContent() {
  // 📝 CHANGE 1: clearCart function ko useCart() se nikaal kar yahan active kiya taake order ke baad cart khaali ho sakay
  const { items, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { t } = useLanguage();
  const [checkout, setCheckout] = useState(initialCheckout);
  const [submitting, setSubmitting] = useState(false);

  const finalTotalBill = items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    const hasDiscount = product && product.discountPercentage > 0;
    const finalUnitPrice = hasDiscount 
      ? item.unitPrice * (1 - product.discountPercentage / 100) 
      : item.unitPrice;
    return total + (finalUnitPrice * item.quantity);
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckout({
      ...checkout,
      [name]: name === "phone" ? sanitizePhoneInput(value) : value,
    });
  };

  const phoneInvalid =
    checkout.phone.length > 0 && !isValidPakistaniPhone(checkout.phone);
  const canPlaceOrder =
    checkout.fullName.trim() &&
    checkout.address.trim() &&
    isValidPakistaniPhone(checkout.phone) &&
    !submitting;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0 || !canPlaceOrder) return;

    setSubmitting(true);

    try {
      const processedItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const hasDiscount = product && product.discountPercentage > 0;
        const finalUnitPrice = hasDiscount 
          ? item.unitPrice * (1 - product.discountPercentage / 100) 
          : item.unitPrice;

        return {
          productName: item.name,
          quantity: formatQuantity(item),
          subtotal: finalUnitPrice * item.quantity,
        };
      });

      await addDoc(collection(db, "orders"), {
        name: checkout.fullName.trim(),
        phone: checkout.phone.trim(),
        address: checkout.address.trim(),
        items: processedItems,
        totalBill: finalTotalBill,
        createdAt: serverTimestamp(),
      });

      // WhatsApp ka message aur URL pehle generate kar lete hain
      const message = buildWhatsAppMessage(items, finalTotalBill, checkout);
      const number = contactInfo.whatsapp.replace(/\D/g, "");
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

      // 📝 CHANGE 2: User ko success message/alert show kiya
      alert("Shukriya! Aap ka order kamyabi se save ho gaya hai. Ab aap ko WhatsApp par redirect kiya ja raha hai.");

      // 📝 CHANGE 3: Order successfully save hone ke baad input fields ko empty (reset) kar diya
      setCheckout(initialCheckout);

      // 📝 CHANGE 4: Cart mein se saari products ko ek dafa khatam (clear) kar diya
      clearCart();

      // WhatsApp open kiya
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Order error:", error); // 📝 CHANGE 5: Agar koi issue aaye to console mein dikhega debug karne ke liye
      alert(
        "Failed to save your order. Please try again or contact us on WhatsApp directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty__icon">🛒</span>
        <p className="cart-empty__title">{t("cart.emptyTitle")}</p>
        <p className="cart-empty__desc">{t("cart.emptyDesc")}</p>
        <Link to={{ pathname: "/", hash: "#products" }} className="btn btn--primary btn--sm">
          {t("cart.shopProducts")}
        </Link>
      </div>
    );
  }

  const itemLabel =
    items.length === 1 ? t("cart.item") : t("cart.items");

  return (
    <div className="cart-content">
      <div className="cart-items">
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onUpdate={updateQuantity}
            onRemove={removeFromCart}
            t={t}
          />
        ))}
      </div>

      <div className="cart-bill">
        <div className="cart-bill__row">
          <span>
            {t("cart.subtotal")} ({items.length} {itemLabel})
          </span>
          <span>{formatPrice(finalTotalBill)}</span>
        </div>
        <div className="cart-bill__row cart-bill__row--delivery">
          <span>{t("cart.delivery")}</span>
          <span className="cart-bill__free">{t("cart.deliveryPending")}</span>
        </div>
        <div className="cart-bill__total">
          <span>{t("cart.totalBill")}</span>
          <span className="cart-bill__total-amount">{formatPrice(finalTotalBill)}</span>
        </div>
      </div>

      <form className="cart-checkout" onSubmit={handlePlaceOrder}>
        <h3 className="cart-checkout__title">{t("cart.checkoutTitle")}</h3>

        <div className="form-group">
          <label className="form-label" htmlFor="cart-name">
            {t("cart.fullName")}
          </label>
          <input
            className="form-input"
            id="cart-name"
            name="fullName"
            type="text"
            required
            placeholder={t("cart.fullNamePlaceholder")}
            value={checkout.fullName}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cart-phone">
            {t("cart.phone")}
          </label>
          <input
            className={`form-input${phoneInvalid ? " form-input--error" : ""}`}
            id="cart-phone"
            name="phone"
            type="tel"
            required
            placeholder={t("cart.phonePlaceholder")}
            value={checkout.phone}
            onChange={handleChange}
            disabled={submitting}
            inputMode="tel"
            autoComplete="tel"
          />
          {phoneInvalid && (
            <p className="form-error" role="alert">
              {PAKISTANI_PHONE_ERROR}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cart-address">
            {t("cart.address")}
          </label>
          <textarea
            className="form-textarea"
            id="cart-address"
            name="address"
            required
            rows={3}
            placeholder={t("cart.addressPlaceholder")}
            value={checkout.address}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        <div className="cart-checkout__actions">
          <Button
            type="submit"
            variant="accent"
            className="cart-checkout__submit"
            disabled={!canPlaceOrder}
          >
            {submitting ? (
              <>
                <span className="cart-checkout__spinner" aria-hidden="true" />
                {t("cart.saving")}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("cart.placeOrder")}
              </>
            )}
          </Button>
          <button
            type="button"
            className="cart-checkout__clear"
            onClick={clearCart}
            disabled={submitting}
          >
            {t("cart.clearCart")}
          </button>
        </div>
      </form>
    </div>
  );
}