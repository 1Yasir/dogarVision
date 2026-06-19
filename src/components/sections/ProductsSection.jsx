import { useMemo, useState } from "react";
import { products, productFilters, getSortedProducts } from "../../data/siteData";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    const list =
      activeFilter === "all"
        ? products
        : products.filter((p) => p.category === activeFilter);
    return getSortedProducts(list);
  }, [activeFilter]);


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
