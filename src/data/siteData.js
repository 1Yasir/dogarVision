export const colors = {
  primary: "#15803D",
  primaryDark: "#166534",
  primaryLight: "#22C55E",
  accent: "#F59E0B",
  accentDark: "#D97706",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  shadow: "rgba(15, 23, 42, 0.08)",
};

export const navLinks = [
  { key: "home", href: "/#home" },
  { key: "about", href: "/#about" },
  { key: "products", href: "/#products" },
  { key: "cart", href: "/cart", isCart: true },
  { key: "contact", href: "/#contact" },
];

export const features = [
  { key: "biosecurity", icon: "🛡️" },
  { key: "organic", icon: "🌿" },
  { key: "supply", icon: "🚚" },
];

// 🟢 NEW SORTING HELPER: Ab yeh static products par depend nahi karta, jo array isay milegi yeh usay sort karega
export function getSortedProducts(list = []) {
  return [...list].sort((a, b) => Number(b.available) - Number(a.available));
}

export const productFilters = [
  { id: "all", label: "All Products" },
  { id: "eggs", label: "Eggs" },
  { id: "chicken", label: "Chicken" },
  { id: "chicks", label: "Chicks" },
  { id: "achar", label: "Achar" },
  { id: "dairy", label: "Dairy" },
];

export const contactInfo = {
  phone: "+923044169153",
  whatsapp: "+923044169153",
  address: "Sehjowal Chak No. 11, Tehsil Pattoki, District Kasur",
  email: "info@dogarvision.com",
  businessHours: "Monday to Sunday — 24 Hours Service Available",
};

export const footerLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Contact", href: "/#contact" },
];