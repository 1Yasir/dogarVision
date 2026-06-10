import { useState } from "react";
import { products, productFilters } from "../../data/siteData";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? products
    : products.filter((p) => p.category === activeFilter);

  return (
    <section id="products" className="section">
      <div className="container">
        <SectionTitle
          label="Our Products"
          title="Fresh From Our Farms"
          desc="Browse our farm-fresh poultry and premium homemade achar. Available for wholesale, retail, and bulk orders with competitive pricing."
        />

        <div className="products__filters">
          {productFilters.map(({ id, label }) => (
            <button
              key={id}
              className={`filter-btn ${activeFilter === id ? "filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(id)}
            >
              {label}
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
