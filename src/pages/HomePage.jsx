import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import SeoHelmet from "../components/common/SeoHelmet";
import HeroSlider from "../components/sections/HeroSlider";
import AboutSection from "../components/sections/AboutSection";
import ProductsSection from "../components/sections/ProductsSection";
import CartFab from "../components/cart/CartFab";
import ContactSection from "../components/sections/ContactSection";
import FeedbackSection from "../components/sections/FeedbackSection";
import { seoCopy } from "../data/copy";

export default function HomePage() {
  return (
    <div className="bg-body">
      <SeoHelmet
        title={seoCopy.home.title}
        description={seoCopy.home.description}
        keywords={seoCopy.home.keywords}
      />
      <NavBar />
      <main>
        <HeroSlider />
        <AboutSection />
        <ProductsSection />
        <ContactSection />
        <FeedbackSection />
      </main>
      <Footer />
      <CartFab />
      <WhatsAppFloat />
    </div>
  );
}
