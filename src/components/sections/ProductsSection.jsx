import { useMemo, useState, useEffect } from "react";
import { productFilters, getSortedProducts } from "../../data/siteData";
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

        {/* Filter Buttons */}
        <div className="products__filters">
          {productFilters.map(({ id }) => (
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
