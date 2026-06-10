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
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Cart", href: "/cart", isCart: true },
  { label: "Contact", href: "/#contact" },
];

export const features = [
  {
    icon: "🛡️",
    title: "Biosecurity & Hygiene",
    desc: "Strict disease control protocols and a clean, sanitized environment keep our flock healthy and safe.",
  },
  {
    icon: "🌿",
    title: "100% Organic Feed",
    desc: "No harmful chemicals or growth promoters — only natural, high-quality feed for completely organic growth.",
  },
  {
    icon: "🚚",
    title: "Consistent Supply",
    desc: "Fresh daily production with reliable wholesale delivery to grocery stores, restaurants, and bulk buyers.",
  },
];

export const products = [
  {
    id: "eggs",
    category: "eggs",
    name: "Fresh Table Eggs",
    desc: "Farm-fresh, nutrient-rich eggs available in wholesale crates or retail packs. Daily collection ensures maximum freshness.",
    price: "Rs. 280 / crate",
    unitPrice: 280,
    unit: "crate",
    unitType: "unit",
    badge: "Best Seller",
    imageLabel: "Fresh Eggs",
    emoji: "🥚",
  },
  {
    id: "chicken",
    category: "chicken",
    name: "Broiler Chicken",
    desc: "Healthy, well-raised broiler chicken available live or as clean, processed meat. Ideal for restaurants and retailers.",
    price: "Rs. 320 / kg",
    unitPrice: 320,
    unit: "kg",
    unitType: "unit",
    badge: "Premium",
    imageLabel: "Broiler Chicken",
    emoji: "🍗",
  },
  {
    id: "chicks",
    category: "chicks",
    name: "Day-Old Chicks (DOC)",
    desc: "Vaccinated, high-survival day-old chicks for farmers and breeders. Strong genetics with expert hatchery care.",
    price: "Rs. 85 / chick",
    unitPrice: 85,
    unit: "chick",
    unitType: "unit",
    badge: "For Farmers",
    imageLabel: "Day-Old Chicks",
    emoji: "🐣",
  },
  {
    id: "achar",
    category: "achar",
    name: "Premium Homemade Achar",
    desc: "100% homemade pickles prepared with premium spices and fresh ingredients. No artificial colors or preservatives — bold, authentic flavor in every jar.",
    price: "Rs. 450 / kg",
    unitPrice: 450,
    unit: "kg",
    unitType: "kg",
    kgOptions: [0.5, 1, 2, 5],
    badge: "New Launch",
    imageLabel: "Homemade Achar",
    emoji: "🫙",
    detailPath: "/product/achar",
  },
];

export const productFilters = [
  { id: "all", label: "All Products" },
  { id: "eggs", label: "Eggs" },
  { id: "chicken", label: "Chicken" },
  { id: "chicks", label: "Chicks" },
  { id: "achar", label: "Achar" },
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
