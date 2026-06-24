import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import CartDrawer from "./components/cart/CartDrawer";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}