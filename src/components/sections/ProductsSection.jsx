import { useMemo, useState, useEffect } from "react";
// Humne yahan se static 'products' ko hata diya hai, ab sirf filters aur sorting helper chahiye
import { productFilters, getSortedProducts } from "../../data/siteData";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "./ProductCard";

// Firebase Imports
import { db } from "../../firebase"; // Sahi path check kar lein apne project ke mutabiq
import { collection, onSnapshot } from "firebase/firestore";

export default function ProductsSection() {
  const [productsList, setProductsList] = useState([]); // Live products state
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true); // Loading state
  const { t } = useLanguage();

  // 🔴 Firebase se real-time data fetch karne ka effect
  useEffect(() => {
    const productsRef = collection(db, "products");

    // onSnapshot se data real-time update hoga (jaise hi stock kam hoga frontend khud badal jaye ga)
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        // Agat document ID (id) database fields mein nahi hai to hum use add kar dete hain
        id: doc.id, 
      }));
      setProductsList(fetchedProducts);
      setLoading(false);
    }, (error) => {
      console.error("Firebase se products lane mein error: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Component unmount hone par connection close
  }, []);

  // Filtered logic ab static products ki jagah 'productsList' state use karegi
  const filtered = useMemo(() => {
    const list =
      activeFilter === "all"
        ? productsList
        : productsList.filter((p) => p.category === activeFilter);
    return getSortedProducts(list);
  }, [activeFilter, productsList]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem", fontWeight: "bold" }}>
        Products load ho rahi hain...
      </div>
    );
  }

  return (
    <section id="products" className="section">
      <div className="container">
        <SectionTitle
          label={t("products.label")}
          title={t("products.title")}
          desc={t("products.desc")}
        />

        <div className="products__filters">
          {productFilters.map(({ id }) => (
            <button
              key={id}
              className={`filter-btn ${activeFilter === id ? "filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(id)}
            >
              {t(`products.filters.${id}`)}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}