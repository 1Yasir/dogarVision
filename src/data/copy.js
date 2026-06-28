export const navCopy = {
  home: "Home",
  about: "About Us",
  products: "Our Shop",
  cart: "Cart",
  contact: "Contact",
};

export const heroCopy = {
  orderNow: "Order Now",
  loading: "Loading fresh organic products…",
  slides: {
    // 1. New Agriculture Fruit Slide (Kinnow, Mangoes, Fruits Agriculture Focus)
    agriculture: {
      badge: "Export Quality · Premium Fruits",
      title: "Fresh Seasonal & Premium",
      highlight: "Organic Fruits",
      subtitle:
        "Premium export-quality seasonal fruits including sweet Kinnows, rich Mangoes, and fresh Guavas (Amrood) — handpicked direct from certified organic farms.",
    },
    achar: {
      badge: "100% Traditional",
      title: "Homemade & Authentic Premium",
      highlight: "Traditional Achar",
      subtitle:
        "Traditional family recipes, sun-ripened ingredients, and zero artificial preservatives — crafted in small batches with pure oils for authentic home taste.",
    },
    poultry: {
      badge: "Farm Fresh · Certified Organic",
      title: "Fresh, Healthy & Premium",
      highlight: "Poultry & Eggs",
      subtitle:
        "High-quality broiler chicken, nutrient-dense organic eggs, and healthy day-old chicks raised with the highest biosecurity and clean farming standards.",
    },
    dairy: {
      badge: "Pure & Natural Dairy",
      title: "Khalis Farm Milk & Traditional",
      highlight: "Desi Ghee & Dairy",
      subtitle:
        "Pure, unprocessed farm-fresh milk and traditional golden desi ghee prepared with ancient slow-churning methods. 100% rich in natural nutrients.",
    },
  },
};

export const aboutCopy = {
  label: "About Our Ecosystem",
  title: "Why Choose Our Organic Agriculture?",
  desc: "Through sustainable agriculture, strict bio-security, and 100% natural practices, we ensure that our dairy, poultry, fresh fruits, and homemade organic foods are completely healthy, pure, and premium. We serve local communities, wholesale markets, national distributors, and international clients.",
  features: {
    naturalFarming: {
      title: "Sustainable Agriculture",
      desc: "We follow natural farming and organic cultivation methods to protect nutrient richness without toxic pesticides.",
    },
    biosecurity: {
      title: "Biosecurity & Traceability",
      desc: "Strict disease control protocols and automated clean environments keep our livestock, poultry, and dairy production safe.",
    },
    globalSupply: {
      title: "Global Supply Chain",
      desc: "Consistent daily production optimized for global standards, serving local households, wholesale markets, and international distribution.",
    },
  },
};

export const productsCopy = {
  label: "Our Marketplace",
  title: "Fresh From Our Farms To The World",
  desc: "Browse our premium range of organic fruits, farm-fresh dairy, pure poultry, and premium traditional achar. Built for global retail and wholesale.",
  loading: "Loading fresh products…",
  comingSoon: "Coming Soon",
  addToCart: "Add to Cart",
  added: "✓ Added!",
  viewDetails: "View Details →",
  unavailableAlert: (name) =>
    `Sorry! ${name} is not available yet. It will be launched soon in the next phase.`,
  filters: {
    all: "All Marketplace",
    dairy: "Dairy & Milk",
    fruits: "Organic Fruits",
    achar: "Homemade Achar",
    eggs: "Organic Eggs",
    chicken: "Fresh Chicken",
    chicks: "Day-Old Chicks",
  },
};

export const contactCopy = {
  label: "Global Operations",
  title: "Connect With Us",
  desc: "Reach out for local orders, national wholesale distributions, or international export inquiries.",
  phoneLabel: "Phone / WhatsApp Support",
  addressLabel: "Head Office & Farm Address",
  hoursLabel: "Operational Hours",
};

export const cartCopy = {
  breadcrumbHome: "Home",
  breadcrumbCart: "Cart",
  label: "Live Billing Engine",
  title: "Your Cart & Secure Checkout",
  desc: "Review your organic items, adjust weights/quantities, and finalize your order directly via WhatsApp with automated live bill calculation.",
  emptyTitle: "Your organic basket is empty",
  emptyDesc: "Explore our farm-fresh categories and add premium items to get started.",
  shopProducts: "Browse Marketplace",
  subtotal: "Subtotal",
  item: "product",
  items: "products",
  delivery: "Shipping & Logistics",
  deliveryPending: "Calculated based on location",
  totalBill: "Total Amount Payable",
  checkoutTitle: "International Logistics & Delivery Details",
  fullName: "Full Name / Company Name *",
  fullNamePlaceholder: "Enter your full name or corporate identity",
  phone: "Contact Number (WhatsApp Active) *",
  phonePlaceholder: "+92 3xxxxxxxxx",
  address: "Complete Destination Address *",
  addressPlaceholder: "House/Plot, Street, Area, City, State, Country",
  placeOrder: "Confirm Order via WhatsApp",
  saving: "Processing your order securely…",
  clearCart: "Reset Cart",
  decrease: "Decrease",
  increase: "Increase",
  quantity: "Quantity for",
  remove: "Remove Item",
  orderSuccess: "Thank you! Your order was generated and logged successfully.",
  orderError: "Could not log the order. Please retry or contact our export desk on WhatsApp.",
  stockChanged: (name, available) =>
    `${name} has limited stock. Only ${available} units available — please adjust before international checkout.`,
};

export const seoCopy = {
  home: {
    // Title ko clean aur to-the-point kiya taakay template ke sath double na lagay
    title: "Premium Organic Agriculture, Dairy & Poultry Exports",
    description:
      "Buy export-quality organic fruits (mangoes, kinnow), pure desi ghee, khalis farm milk, homemade achar, and premium poultry online. Worldwide standards by Dogar Vision.",
    keywords:
      "organic food pakistan, pure desi ghee lahore, fresh milk delivery, mango exports pakistan, premium kinnow online, traditional achar, agriculture marketplace, dogar vision",
  },
  cart: {
    title: "Secure Checkout & Logistics",
    description:
      "Finalize your order for premium organic food, agriculture produce, dairy, and poultry. Fast delivery and real-time WhatsApp order tracking.",
    keywords: "dogar vision cart, order organic food online, wholesale agriculture delivery",
  },
  admin: {
    title: "Global Management Control",
    description: "Dogar Vision internal enterprise dashboard to monitor global supply, manage inventories, and track client orders.",
    keywords: "dogar vision admin dashboard, agriculture inventory management",
  },
  product: (name) => ({
    title: `${name} | Certified Organic & Pure`,
    description: `Order premium quality ${name} from Dogar Vision. 100% natural, farm-fresh agriculture and organic production standard.`,
    keywords: `${name}, organic ${name}, buy ${name} pakistan, export quality organic foods, dogar vision`,
  }),
};