/** English-only UI copy — replaces removed i18n layer. */

export const navCopy = {
  home: "Home",
  about: "About",
  products: "Products",
  cart: "Cart",
  contact: "Contact",
};

export const heroCopy = {
  orderNow: "Order Now",
  loading: "Loading fresh products…",
  slides: {
    achar: {
      badge: "Premium Quality",
      title: "100% Homemade & Authentic",
      highlight: "Achar",
      subtitle:
        "Traditional family recipes, sun-ripened ingredients, and zero artificial preservatives — crafted in small batches for authentic taste.",
    },
    poultry: {
      badge: "Farm Fresh · Premium Quality",
      title: "Fresh, Healthy & Organic",
      highlight: "Poultry Products",
      subtitle:
        "High-quality chicken, organic eggs, and day-old chicks raised with the highest biosecurity and hygiene standards for your family.",
    },
    dairy: {
      badge: "Pure & Organic",
      title: "Fresh Milk & Traditional",
      highlight: "Dairy Products",
      subtitle:
        "Pure, farm-fresh milk and traditional desi ghee prepared with the highest hygiene standards. Rich in nutrients and authentic taste.",
    },
  },
};

export const aboutCopy = {
  label: "About Us",
  title: "Why Choose Our Products?",
  desc: "Hard work, strict bio-security, and high-quality feed ensure that all our poultry and organic farm-fresh products are completely healthy, pure, and natural. We serve wholesale buyers, grocery stores, restaurants, and direct consumers.",
  features: {
    biosecurity: {
      title: "Biosecurity & Hygiene",
      desc: "Strict disease control protocols and a clean, sanitized environment keep our flock healthy and safe.",
    },
    organic: {
      title: "100% Organic Feed",
      desc: "No harmful chemicals or growth promoters — only natural, high-quality feed for completely organic growth.",
    },
    supply: {
      title: "Consistent Supply",
      desc: "Fresh daily production with reliable wholesale delivery to grocery stores, restaurants, and bulk buyers.",
    },
  },
};

export const productsCopy = {
  label: "Our Products",
  title: "Fresh From Our Farms",
  desc: "Browse our farm-fresh poultry and premium homemade achar. Available for wholesale, retail, and bulk orders with competitive pricing.",
  loading: "Loading products…",
  comingSoon: "Coming Soon",
  addToCart: "Add to Cart",
  added: "✓ Added!",
  viewDetails: "View Details →",
  unavailableAlert: (name) =>
    `Sorry! ${name} is not available yet. It will be launched soon.`,
  filters: {
    all: "All Products",
    eggs: "Eggs",
    chicken: "Chicken",
    chicks: "Chicks",
    achar: "Achar",
    dairy: "Dairy",
  },
};

export const contactCopy = {
  label: "Get in Touch",
  title: "Contact Us",
  desc: "Reach out for orders, wholesale inquiries, or any questions about our farm-fresh products.",
  phoneLabel: "Phone / WhatsApp",
  addressLabel: "Farm Address",
  hoursLabel: "Business Hours",
};

export const cartCopy = {
  breadcrumbHome: "Home",
  breadcrumbCart: "Cart",
  label: "Live Billing",
  title: "Your Cart & Checkout",
  desc: "Review your order, adjust quantities, and place your order via WhatsApp with live bill calculation.",
  emptyTitle: "Your cart is empty",
  emptyDesc: "Browse our products and add items to get started.",
  shopProducts: "Shop Products",
  subtotal: "Subtotal",
  item: "item",
  items: "items",
  delivery: "Delivery",
  deliveryPending: "To be confirmed",
  totalBill: "Total Bill",
  checkoutTitle: "Checkout Details",
  fullName: "Full Name *",
  fullNamePlaceholder: "Your full name",
  phone: "Phone Number *",
  phonePlaceholder: "03xxxxxxxxx",
  address: "Delivery Address *",
  addressPlaceholder: "House no., street, area, city",
  placeOrder: "Place Order via WhatsApp",
  saving: "Saving order…",
  clearCart: "Clear Cart",
  decrease: "Decrease",
  increase: "Increase",
  quantity: "Quantity for",
  remove: "Remove",
  orderSuccess: "Thank you! Your order was saved successfully.",
  orderError: "Could not save the order. Please try again or contact us on WhatsApp.",
  stockChanged: (name, available) =>
    `${name} is low on stock. Only ${available} available — please update your cart.`,
};

export const seoCopy = {
  home: {
    title: "Pure Desi Ghee & Premium Organic Products",
    description:
      "Shop pure desi ghee, organic honey, homemade achar, farm-fresh eggs, and dairy delivery across Pakistan. Dogar Vision — trusted organic food online.",
    keywords:
      "desi ghee lahore, organic store pakistan, dogar vision online shopping, pure honey, homemade achar, dairy delivery",
  },
  cart: {
    title: "Your Cart & Checkout",
    description:
      "Review your organic food order, adjust quantities, and checkout via WhatsApp. Fresh poultry, desi ghee, and homemade achar from Dogar Vision.",
    keywords: "dogar vision cart, organic food checkout pakistan, whatsapp order",
  },
  admin: {
    title: "Admin Dashboard",
    description: "Dogar Vision admin — manage products, orders, and customer reviews.",
    keywords: "dogar vision admin",
  },
  product: (name) => ({
    title: `${name} — Buy Online`,
    description: `Order ${name} from Dogar Vision. Pure, organic, farm-fresh products delivered across Pakistan.`,
    keywords: `${name}, dogar vision, organic food pakistan, desi ghee lahore`,
  }),
};
