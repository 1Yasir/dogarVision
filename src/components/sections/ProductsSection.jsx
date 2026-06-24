import { useMemo, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
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
      <section id="products" className="py-5">
        <Container className="text-center">
          <p className="text-muted">{productsCopy.loading}</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="products" className="py-5">
      <Container>
        <SectionTitle
          label={productsCopy.label}
          title={productsCopy.title}
          desc={productsCopy.desc}
        />

        <div className="d-flex justify-center mb-4">
          <ButtonGroup className="flex-wrap">
            {productFilters.map(({ id }) => (
              <Button
                key={id}
                variant={activeFilter === id ? "success" : "outline-success"}
                onClick={() => setActiveFilter(id)}
                size="sm"
                className="mb-1"
              >
                {productsCopy.filters[id]}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Row className="g-4">
          {filtered.map((product) => (
            <Col key={product.id} sm={6} lg={4}>
              <ProductCard {...product} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}