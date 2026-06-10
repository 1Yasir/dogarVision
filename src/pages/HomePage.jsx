import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import HeroSlider from "../components/sections/HeroSlider";
import AboutSection from "../components/sections/AboutSection";
import ProductsSection from "../components/sections/ProductsSection";
import CartFab from "../components/cart/CartFab";
import ContactSection from "../components/sections/ContactSection";
import FeedbackSection from "../components/sections/FeedbackSection";

export default function HomePage() {
  return (
    <div className="poultry">
      <NavBar />
      <HeroSlider />
      <AboutSection />
      <ProductsSection />
      <ContactSection />
      <FeedbackSection />
      <Footer />
      <CartFab />
      <WhatsAppFloat />
    </div>
  );
}
