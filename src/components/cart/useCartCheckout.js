import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { contactInfo } from "../../data/siteData";
import { useCart } from "../../context/CartContext";
import { cartCopy } from "../../data/copy.js";
import { db } from "../../firebase";
import { formatQuantity, buildWhatsAppMessage } from "../../utils/cartHelpers";
import {
  sanitizePhoneInput,
  isValidPakistaniPhone,
  PAKISTANI_PHONE_ERROR,
} from "../../utils/phoneValidation";

const initialCheckout = {
  fullName: "",
  phone: "",
  address: "",
};

export function useCartCheckout({ onOrderSuccess, idPrefix = "cart" } = {}) {
  const { items, clearCart, totalBill } = useCart();
  const [checkout, setCheckout] = useState(initialCheckout);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckout((prev) => ({
      ...prev,
      [name]: name === "phone" ? sanitizePhoneInput(value) : value,
    }));
    setErrorMessage("");
  };

  const phoneInvalid =
    checkout.phone.length > 0 && !isValidPakistaniPhone(checkout.phone);

  const canPlaceOrder =
    items.length > 0 &&
    checkout.fullName.trim() &&
    checkout.address.trim() &&
    isValidPakistaniPhone(checkout.phone) &&
    !submitting;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!canPlaceOrder) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      for (const item of items) {
        const productRef = doc(db, "products", item.productId);
        const freshSnap = await getDoc(productRef);

        if (freshSnap.exists()) {
          const currentStock = Number(freshSnap.data().stockCount) || 0;

          if (currentStock < item.quantity) {
            setErrorMessage(cartCopy.stockChanged(item.name, currentStock));
            setSubmitting(false);
            return;
          }
        }
      }

      const processedItems = items.map((item) => ({
        productName: item.name,
        quantity: formatQuantity(item),
        subtotal: item.unitPrice * item.quantity,
      }));

      await addDoc(collection(db, "orders"), {
        name: checkout.fullName.trim(),
        phone: checkout.phone.trim(),
        address: checkout.address.trim(),
        items: processedItems,
        totalBill,
        createdAt: serverTimestamp(),
      });

      const stockUpdates = items.map((item) => {
        const productRef = doc(db, "products", item.productId);
        const orderedQty = Number(item.quantity) || 1;
        return updateDoc(productRef, {
          stockCount: increment(-orderedQty),
        });
      });

      await Promise.all(stockUpdates);

      const message = buildWhatsAppMessage(items, totalBill, checkout);
      const number = contactInfo.whatsapp.replace(/\D/g, "");
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

      alert(cartCopy.orderSuccess);

      setCheckout(initialCheckout);
      clearCart();
      onOrderSuccess?.();

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Order error:", error);
      setErrorMessage(cartCopy.orderError);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    checkout,
    handleChange,
    phoneInvalid,
    canPlaceOrder,
    submitting,
    errorMessage,
    handlePlaceOrder,
    phoneError: PAKISTANI_PHONE_ERROR,
    idPrefix,
  };
}