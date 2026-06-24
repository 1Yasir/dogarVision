import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import SeoHelmet from "../components/common/SeoHelmet";
import { seoCopy } from "../data/copy";
import { db } from "../firebase";
import { clampAdminNumeric } from "../utils/stockValidation";

const EMPTY_PRODUCT_FORM = {
  name: "",
  price: "",
  unitPrice: "",
  originalPrice: "",
  discountPercentage: "0",
  unit: "kg",
  unitType: "kg",
  stockCount: "",
  emoji: "📦",
  desc: "",
  badge: "",
  category: "dairy",
  imageLabel: "",
  detailPath: "",
  available: true,
  kgOptions: "0.5,1,2",
};

function parseKgOptions(raw) {
  return raw
    .split(",")
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

function buildProductPayload(form) {
  const unitPrice = clampAdminNumeric(form.unitPrice);
  const originalPrice =
    clampAdminNumeric(form.originalPrice) || unitPrice;
  const stockCount = clampAdminNumeric(form.stockCount);
  const discountPercentage = clampAdminNumeric(form.discountPercentage);
  const name = form.name.trim();
  const unit = form.unit.trim() || "kg";

  return {
    name,
    price: form.price.trim() || `Rs. ${unitPrice} / ${unit}`,
    unitPrice,
    originalPrice,
    discountPercentage,
    unit,
    unitType: form.unitType.trim() || "kg",
    stockCount,
    emoji: form.emoji.trim() || "📦",
    desc: form.desc.trim(),
    badge: form.badge.trim(),
    category: form.category.trim(),
    imageLabel: form.imageLabel.trim() || name,
    detailPath:
      form.detailPath.trim() ||
      `/product/${name.toLowerCase().replace(/\s+/g, "-")}`,
    available: form.available,
    kgOptions: parseKgOptions(form.kgOptions).length
      ? parseKgOptions(form.kgOptions)
      : [0.5, 1, 2],
  };
}

function productToForm(prod) {
  return {
    name: prod.name || "",
    price: prod.price || "",
    unitPrice: String(prod.unitPrice ?? ""),
    originalPrice: String(prod.originalPrice ?? ""),
    discountPercentage: String(prod.discountPercentage ?? "0"),
    unit: prod.unit || "kg",
    unitType: prod.unitType || "kg",
    stockCount: String(prod.stockCount ?? ""),
    emoji: prod.emoji || "📦",
    desc: prod.desc || "",
    badge: prod.badge || "",
    category: prod.category || "dairy",
    imageLabel: prod.imageLabel || "",
    detailPath: prod.detailPath || "",
    available: prod.available !== false,
    kgOptions: Array.isArray(prod.kgOptions)
      ? prod.kgOptions.join(",")
      : "0.5,1,2",
  };
}

function formatTimestamp(ts) {
  if (!ts) return "—";
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleString();
  }
  return "—";
}

function ProductFormFields({ form, setForm, idPrefix = "" }) {
  const clampField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: String(clampAdminNumeric(prev[field])),
    }));
  };

  return (
    <Row className="g-3">
      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-name`}>
          <Form.Label>Product Name *</Form.Label>
          <Form.Control
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Pure Desi Ghee"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-imageLabel`}>
          <Form.Label>Image Label</Form.Label>
          <Form.Control
            value={form.imageLabel}
            onChange={(e) =>
              setForm({ ...form, imageLabel: e.target.value })
            }
            placeholder="e.g. DESI GHEE"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-emoji`}>
          <Form.Label>Emoji Icon</Form.Label>
          <Form.Control
            value={form.emoji}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            placeholder="e.g. 🍯"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-unitPrice`}>
          <Form.Label>Unit Price (Rs.) *</Form.Label>
          <Form.Control
            required
            type="number"
            min={0}
            step="any"
            value={form.unitPrice}
            onChange={(e) =>
              setForm({ ...form, unitPrice: e.target.value })
            }
            onBlur={() => clampField("unitPrice")}
          />
          <Form.Text muted>
            Clamped to 0 on blur — prices cannot be negative.
          </Form.Text>
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-originalPrice`}>
          <Form.Label>Original Price (Rs.)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            step="any"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({ ...form, originalPrice: e.target.value })
            }
            onBlur={() => clampField("originalPrice")}
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-discountPercentage`}>
          <Form.Label>Discount %</Form.Label>
          <Form.Control
            type="number"
            min={0}
            step="any"
            value={form.discountPercentage}
            onChange={(e) =>
              setForm({ ...form, discountPercentage: e.target.value })
            }
            onBlur={() => clampField("discountPercentage")}
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-price`}>
          <Form.Label>Price Display Text</Form.Label>
          <Form.Control
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. Rs. 3500 / kg"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-unit`}>
          <Form.Label>Unit</Form.Label>
          <Form.Control
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="kg"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-unitType`}>
          <Form.Label>Unit Type</Form.Label>
          <Form.Control
            value={form.unitType}
            onChange={(e) =>
              setForm({ ...form, unitType: e.target.value })
            }
            placeholder="kg"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-stockCount`}>
          <Form.Label>Stock Count *</Form.Label>
          <Form.Control
            required
            type="number"
            min={0}
            step="1"
            value={form.stockCount}
            onChange={(e) =>
              setForm({ ...form, stockCount: e.target.value })
            }
            onBlur={() => clampField("stockCount")}
          />
          <Form.Text muted>
            Stock is clamped with clampAdminNumeric — never stored below 0.
          </Form.Text>
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-badge`}>
          <Form.Label>Badge</Form.Label>
          <Form.Control
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="e.g. New Launch"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-category`}>
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="dairy">Dairy</option>
            <option value="poultry">Poultry</option>
            <option value="organic">Organic</option>
            <option value="eggs">Eggs</option>
            <option value="chicken">Chicken</option>
            <option value="chicks">Chicks</option>
            <option value="achar">Achar</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-detailPath`}>
          <Form.Label>Detail Path</Form.Label>
          <Form.Control
            value={form.detailPath}
            onChange={(e) =>
              setForm({ ...form, detailPath: e.target.value })
            }
            placeholder="/product/ghee"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4}>
        <Form.Group controlId={`${idPrefix}-kgOptions`}>
          <Form.Label>kg Options (comma-separated)</Form.Label>
          <Form.Control
            value={form.kgOptions}
            onChange={(e) =>
              setForm({ ...form, kgOptions: e.target.value })
            }
            placeholder="0.5,1,2"
          />
        </Form.Group>
      </Col>

      <Col md={6} lg={4} className="d-flex align-items-end">
        <Form.Group controlId={`${idPrefix}-available`}>
          <Form.Check
            type="checkbox"
            label="Available for purchase"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
          />
        </Form.Group>
      </Col>

      <Col xs={12}>
        <Form.Group controlId={`${idPrefix}-desc`}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            placeholder="Product description…"
          />
        </Form.Group>
      </Col>
    </Row>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [createForm, setCreateForm] = useState(EMPTY_PRODUCT_FORM);
  const [editForm, setEditForm] = useState(EMPTY_PRODUCT_FORM);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubFeedbacks = onSnapshot(collection(db, "feedbacks"), (snapshot) => {
      setFeedbacks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubFeedbacks();
    };
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.totalBill) || 0), 0),
    [orders]
  );

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim() || createForm.unitPrice === "" || createForm.stockCount === "") {
      alert("Name, unit price, and stock count are required.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "products"), buildProductPayload(createForm));
      setCreateForm(EMPTY_PRODUCT_FORM);
    } catch (err) {
      console.error(err);
      alert("Could not add product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditForm(productToForm(prod));
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    try {
      await updateDoc(
        doc(db, "products", editingProduct.id),
        buildProductPayload(editForm)
      );
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Could not update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (prod) => {
    if (
      !window.confirm(
        `Delete "${prod.name}"? This cannot be undone.`
      )
    ) {
      return;
    }
    if (
      !window.confirm(
        "Are you absolutely sure? Click OK to permanently delete this product."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", prod.id));
    } catch (err) {
      console.error(err);
      alert("Could not delete product. Please try again.");
    }
  };

  const handleApproveFeedback = async (id) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), { approved: true });
    } catch (err) {
      console.error(err);
      alert("Could not approve review. Please try again.");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await deleteDoc(doc(db, "feedbacks", id));
    } catch (err) {
      console.error(err);
      alert("Could not delete review. Please try again.");
    }
  };

  return (
    <>
      <SeoHelmet {...seoCopy.admin} />

      <Container fluid="lg" className="py-4">
        <h1 className="mb-4 border-bottom pb-2">Dogar Vision — Admin Dashboard</h1>

        <Tabs defaultActiveKey="products" className="mb-4">
          <Tab eventKey="products" title="Products Management">
            <Accordion className="mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Add New Product</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleCreateProduct}>
                    <ProductFormFields
                      form={createForm}
                      setForm={setCreateForm}
                      idPrefix="create"
                    />
                    <div className="text-end mt-3">
                      <Button type="submit" variant="success" disabled={saving}>
                        {saving ? "Saving…" : "Create Product"}
                      </Button>
                    </div>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <h2 className="h4 mb-3">All Products</h2>
            <div className="table-responsive">
              <Table striped bordered hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Stock</th>
                    <th>Available</th>
                    <th>Badge</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted">
                        No products yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <span className="me-1">{prod.emoji}</span>
                          <strong>{prod.name}</strong>
                          <div className="small text-muted">{prod.price}</div>
                        </td>
                        <td>{prod.category || "—"}</td>
                        <td>Rs. {prod.unitPrice ?? "—"}</td>
                        <td>
                          <span
                            className={
                              (prod.stockCount ?? 0) <= 0
                                ? "text-danger fw-bold"
                                : "text-success fw-bold"
                            }
                          >
                            {prod.stockCount ?? 0} {prod.unit || "kg"}
                          </span>
                        </td>
                        <td>
                          {prod.available !== false ? (
                            <Badge bg="success">Yes</Badge>
                          ) : (
                            <Badge bg="secondary">No</Badge>
                          )}
                        </td>
                        <td>{prod.badge || "—"}</td>
                        <td>{prod.discountPercentage ?? 0}%</td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => openEditModal(prod)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteProduct(prod)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="orders" title="Customer Orders Log">
            <Alert variant="info" className="d-flex flex-wrap gap-3 justify-content-between">
              <span>
                <strong>Total Orders:</strong> {orders.length}
              </span>
              <span>
                <strong>Total Revenue:</strong> Rs. {totalRevenue.toLocaleString()}
              </span>
            </Alert>

            <div className="table-responsive">
              <Table striped bordered hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.name || "—"}</td>
                        <td>{order.phone || "—"}</td>
                        <td className="small">{order.address || "—"}</td>
                        <td className="small text-nowrap">
                          {formatTimestamp(order.createdAt)}
                        </td>
                        <td className="small">
                          {order.items?.length ? (
                            <ul className="mb-0 ps-3">
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.productName} — {item.quantity}
                                  {item.subtotal != null &&
                                    ` (Rs. ${item.subtotal})`}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="fw-bold text-success">
                          Rs. {order.totalBill ?? 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="feedbacks" title="Review Approvals">
            <Row className="g-3">
              {feedbacks.length === 0 ? (
                <Col xs={12}>
                  <p className="text-muted">No reviews yet.</p>
                </Col>
              ) : (
                feedbacks.map((feed) => (
                  <Col key={feed.id} xs={12} md={6} lg={4}>
                    <Card
                      className={
                        feed.approved ? "border-success" : "border-warning"
                      }
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title className="h6 mb-0">
                            {feed.name || "Anonymous"}
                          </Card.Title>
                          {feed.approved ? (
                            <Badge bg="success">Approved</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="text-warning mb-2">
                          {"★".repeat(feed.rating || 0)}
                          {"☆".repeat(5 - (feed.rating || 0))}
                        </div>
                        <Card.Text className="small text-muted">
                          {feed.review || feed.comment || "No comment."}
                        </Card.Text>
                        <div className="d-flex gap-2">
                          {!feed.approved && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleApproveFeedback(feed.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteFeedback(feed.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Tab>
        </Tabs>
      </Container>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Product{editingProduct ? `: ${editingProduct.name}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProduct}>
          <Modal.Body>
            <ProductFormFields
              form={editForm}
              setForm={setEditForm}
              idPrefix="edit"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}