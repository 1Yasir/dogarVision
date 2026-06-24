import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  clampQuantity,
  roundQuantity,
  STOCK_MAX_MESSAGE,
} from "../utils/stockValidation";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

function discountedUnitPrice(product) {
  const discount = product.discountPercentage ?? 0;
  const base = Number(product.unitPrice) || 0;
  if (discount > 0) {
    return base - (base * discount) / 100;
  }
  return base;
}

function resolveStockCount(product) {
  return Math.max(0, Number(product?.stockCount) || 0);
}

function cartLineMeta(unitType) {
  const isKg = unitType === "kg";
  return {
    step: isKg ? 0.5 : 1,
    minQty: isKg ? 0.5 : 1,
  };
}

export function CartProvider({ children }) {
  const { showToast } = useToast();

  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem("dv_cart_items");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("dv_cart_items", JSON.stringify(items));
  }, [items]);

  const notifyMaxStock = useCallback(
    (hitMax) => {
      if (hitMax) {
        showToast(STOCK_MAX_MESSAGE, "warning");
      }
    },
    [showToast]
  );

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (!product?.id) return;

      const stockCount = resolveStockCount(product);
      const unitType = product.unitType ?? "unit";
      const { step, minQty } = cartLineMeta(unitType);
      const finalPrice = discountedUnitPrice(product);

      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);

        if (existing) {
          const requested = roundQuantity(
            existing.quantity + quantity,
            unitType
          );
          const { value, hitMax } = clampQuantity(requested, stockCount, minQty);
          notifyMaxStock(hitMax);

          return prev.map((i) =>
            i.productId === product.id
              ? {
                  ...i,
                  quantity: value,
                  stockCount,
                  unitPrice: finalPrice,
                }
              : i
          );
        }

        const requested = roundQuantity(quantity, unitType);
        const { value, hitMax } = clampQuantity(requested, stockCount, minQty);
        notifyMaxStock(hitMax);

        if (stockCount <= 0 && value <= 0) {
          return prev;
        }

        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            emoji: product.emoji,
            unitPrice: finalPrice,
            unit: product.unit,
            unitType,
            quantity: value,
            stockCount,
            step,
            minQty,
          },
        ];
      });
    },
    [notifyMaxStock]
  );

  const updateQuantity = useCallback(
    (productId, delta) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.productId !== productId) return item;

            const rawNext = roundQuantity(item.quantity + delta, item.unitType);
            const stock = item.stockCount ?? 0;
            const { value, hitMax } = clampQuantity(rawNext, stock, item.minQty);
            notifyMaxStock(hitMax);

            return { ...item, quantity: value };
          })
          .filter((item) => item.quantity >= item.minQty)
      );
    },
    [notifyMaxStock]
  );

  const setItemQuantity = useCallback(
    (productId, rawValue) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.productId !== productId) return item;

            const stock = item.stockCount ?? 0;
            const rounded = roundQuantity(rawValue, item.unitType);
            const { value, hitMax } = clampQuantity(rounded, stock, item.minQty);
            notifyMaxStock(hitMax);

            return { ...item, quantity: value };
          })
          .filter((item) => item.quantity >= item.minQty)
      );
    },
    [notifyMaxStock]
  );

  const syncStockCounts = useCallback(
    (products) => {
      const byId = Array.isArray(products)
        ? Object.fromEntries(products.map((p) => [p.id, p]))
        : products;

      setItems((prev) =>
        prev
          .map((item) => {
            const product = byId[item.productId];
            if (!product) return item;

            const stockCount = resolveStockCount(product);
            const price = discountedUnitPrice(product);
            const { value, hitMax } = clampQuantity(item.quantity, stockCount, item.minQty);

            if (hitMax && value < item.quantity) {
              notifyMaxStock(true);
            }

            return {
              ...item,
              stockCount,
              quantity: value,
              unitPrice: price,
            };
          })
          .filter((item) => {
            const stock = item.stockCount ?? 0;
            return stock > 0 && item.quantity >= item.minQty;
          })
      );
    },
    [notifyMaxStock]
  );

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("dv_cart_items");
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const totalBill = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum) => sum + 1, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      setItemQuantity,
      syncStockCounts,
      removeFromCart,
      clearCart,
      totalBill,
      itemCount,
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
    }),
    [
      items,
      addToCart,
      updateQuantity,
      setItemQuantity,
      syncStockCounts,
      removeFromCart,
      clearCart,
      totalBill,
      itemCount,
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}