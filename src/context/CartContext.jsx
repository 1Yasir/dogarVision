import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // 📝 CHANGE 1: Cart items initialize karte waqt pehle localStorage check karein ge
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem("dv_cart_items");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 📝 CHANGE 2: Jab bhi items array mein koi tabdeeli ho, usay automatically localStorage mein save karein
  useEffect(() => {
    localStorage.setItem("dv_cart_items", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          emoji: product.emoji,
          unitPrice: product.unitPrice,
          unit: product.unit,
          unitType: product.unitType,
          quantity,
          step: product.unitType === "kg" ? 0.5 : 1,
          minQty: product.unitType === "kg" ? 0.5 : 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty =
            Math.round((item.quantity + delta * item.step) * 10) / 10;
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity >= item.minQty)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("dv_cart_items"); // 📝 CHANGE 3: Cart clear hone par storage bhi saaf ho jaye
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
    () => items.reduce((sum, item) => sum + 1, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
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