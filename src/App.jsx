import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import CartDrawer from "./components/cart/CartDrawer";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage"; // 1. Login Page import karen (agar pehle se bani hai)
import ProtectedRoute from "./components/common/ProtectedRoute"; // 2. ProtectedRoute import karen
import "./styles/poultry.css";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes - Inhein sab dekh sakte hain */}
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/login" element={<LoginPage />} /> {/* Login Route */}

              {/* Protected Route - Sirf logged in users ke liye */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}