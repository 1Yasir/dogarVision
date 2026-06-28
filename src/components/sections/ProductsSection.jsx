import { useMemo, useState, useEffect } from "react";
import { getSortedProducts } from "../../data/siteData";
import { productsCopy } from "../../data/copy";
import { useCart } from "../../context/CartContext";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "./ProductCard";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ProductsSection() {
  const [productsList, setProductsList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { syncStockCounts } = useCart();

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        }));
        setProductsList(fetchedProducts);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (productsList.length > 0) {
      syncStockCounts(productsList);
    }
  }, [productsList, syncStockCounts]);

  // 🔥 Smart Logic: Sirf wahi buttons show hon ge jinki products database mein hain!
  const activeFilterIds = useMemo(() => {
    // 1. copy.js se saare define filters ki keys uthayein
    const allFilterIds = Object.keys(productsCopy.filters);

    // 2. Filter karein ke kaun si category ke products asall mein mojud hain
    return allFilterIds.filter((id) => {
      if (id === "all") return true; // 'all' wala button hamesha show hoga
      
      // Check karein ke kya productsList mein is category ka kam az kam 1 product hai?
      return productsList.some((product) => product.category === id);
    });
  }, [productsList]);

  const filtered = useMemo(() => {
    const list =
      activeFilter === "all"
        ? productsList
        : productsList.filter((p) => p.category === activeFilter);
    return getSortedProducts(list);
  }, [activeFilter, productsList]);

  if (loading) {
    return (
      <section id="products" className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>{productsCopy.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section">
      <div className="container">
        <SectionTitle
          label={productsCopy.label}
          title={productsCopy.title}
          desc={productsCopy.desc}
        />

        {/* Filter Buttons — Ab sirf active products wale buttons hi dikhein ge */}
        <div className="products__filters">
          {activeFilterIds.map((id) => (
            <button
              key={id}
              className={`filter-btn${activeFilter === id ? " filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(id)}
            >
              {productsCopy.filters[id]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}