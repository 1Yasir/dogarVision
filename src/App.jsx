import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import CartDrawer from "./components/cart/CartDrawer";
// 🟢 'adminDashboard' ko badal kar 'AdminDashboard' (Capital A) kar diya
import AdminDashboard from "./pages/AdminDashboard"; 
import "./styles/poultry.css";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              {/* 🟢 Yahan bhi <AdminDashboard /> capital kar diya */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}