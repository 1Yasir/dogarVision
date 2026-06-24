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
import Button from "../components/common/Button";
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
  emoji: "\u{1F4E6}",
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
    emoji: form.emoji.trim() || "\u{1F4E6}",
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
    emoji: prod.emoji || "\u{1F4E6}",
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
  if (!ts) return "-";
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleString();
  }
  return "-";
}

function ProductFormFields({ form, setForm, idPrefix = "" }) {
  const clampField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: String(clampAdminNumeric(prev[field])),
    }));
  };

  return (
    <div className="admin-form-grid">
      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-name`}>
          Product Name *
        </label>
        <input
          id={`${idPrefix}-name`}
          className="form-input"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Pure Desi Ghee"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-imageLabel`}>
          Image Label
        </label>
        <input
          id={`${idPrefix}-imageLabel`}
          className="form-input"
          value={form.imageLabel}
          onChange={(e) =>
            setForm({ ...form, imageLabel: e.target.value })
          }
          placeholder="e.g. DESI GHEE"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-emoji`}>
          Emoji Icon
        </label>
        <input
          id={`${idPrefix}-emoji`}
          className="form-input"
          value={form.emoji}
          onChange={(e) => setForm({ ...form, emoji: e.target.value })}
          placeholder="e.g. 🐄"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-unitPrice`}>
          Unit Price (Rs.) *
        </label>
        <input
          id={`${idPrefix}-unitPrice`}
          className="form-input"
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
        <p className="admin-form-hint">
          Clamped to 0 on blur — prices cannot be negative.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-originalPrice`}>
          Original Price (Rs.)
        </label>
        <input
          id={`${idPrefix}-originalPrice`}
          className="form-input"
          type="number"
          min={0}
          step="any"
          value={form.originalPrice}
          onChange={(e) =>
            setForm({ ...form, originalPrice: e.target.value })
          }
          onBlur={() => clampField("originalPrice")}
        />
      </div>

      <div className="form-group">
        <label
          className="form-label"
          htmlFor={`${idPrefix}-discountPercentage`}
        >
          Discount %
        </label>
        <input
          id={`${idPrefix}-discountPercentage`}
          className="form-input"
          type="number"
          min={0}
          step="any"
          value={form.discountPercentage}
          onChange={(e) =>
            setForm({ ...form, discountPercentage: e.target.value })
          }
          onBlur={() => clampField("discountPercentage")}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-price`}>
          Price Display Text
        </label>
        <input
          id={`${idPrefix}-price`}
          className="form-input"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="e.g. Rs. 3500 / kg"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-unit`}>
          Unit
        </label>
        <input
          id={`${idPrefix}-unit`}
          className="form-input"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          placeholder="kg"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-unitType`}>
          Unit Type
        </label>
        <input
          id={`${idPrefix}-unitType`}
          className="form-input"
          value={form.unitType}
          onChange={(e) =>
            setForm({ ...form, unitType: e.target.value })
          }
          placeholder="kg"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-stockCount`}>
          Stock Count *
        </label>
        <input
          id={`${idPrefix}-stockCount`}
          className="form-input"
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
        <p className="admin-form-hint">
          Stock is clamped with clampAdminNumeric — never stored below 0.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-badge`}>
          Badge
        </label>
        <input
          id={`${idPrefix}-badge`}
          className="form-input"
          value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}
          placeholder="e.g. New Launch"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-category`}>
          Category
        </label>
        <select
          id={`${idPrefix}-category`}
          className="form-select"
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
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-detailPath`}>
          Detail Path
        </label>
        <input
          id={`${idPrefix}-detailPath`}
          className="form-input"
          value={form.detailPath}
          onChange={(e) =>
            setForm({ ...form, detailPath: e.target.value })
          }
          placeholder="/product/ghee"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-kgOptions`}>
          kg Options (comma-separated)
        </label>
        <input
          id={`${idPrefix}-kgOptions`}
          className="form-input"
          value={form.kgOptions}
          onChange={(e) =>
            setForm({ ...form, kgOptions: e.target.value })
          }
          placeholder="0.5,1,2"
        />
      </div>

      <div className="form-group admin-form-grid__checkbox">
        <label className="admin-checkbox" htmlFor={`${idPrefix}-available`}>
          <input
            id={`${idPrefix}-available`}
            type="checkbox"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
          />
          Available for purchase
        </label>
      </div>

      <div className="form-group admin-form-grid__full">
        <label className="form-label" htmlFor={`${idPrefix}-desc`}>
          Description
        </label>
        <textarea
          id={`${idPrefix}-desc`}
          className="form-textarea"
          rows={2}
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Product description…"
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

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

      <div className="admin-dashboard">
        <div className="container">
          <h1 className="admin-dashboard__title">Dogar Vision - Admin Dashboard</h1>

          <div className="admin-tabs" role="tablist">
            <Button
              type="button"
              variant={activeTab === "products" ? "primary" : "outline"}
              onClick={() => setActiveTab("products")}
            >
              Products Management
            </Button>
            <Button
              type="button"
              variant={activeTab === "orders" ? "primary" : "outline"}
              onClick={() => setActiveTab("orders")}
            >
              Customer Orders Log
            </Button>
            <Button
              type="button"
              variant={activeTab === "feedbacks" ? "primary" : "outline"}
              onClick={() => setActiveTab("feedbacks")}
            >
              Review Approvals
            </Button>
          </div>

          {activeTab === "products" && (
            <div className="admin-panel">
              <details className="admin-accordion">
                <summary className="admin-accordion__summary">Add New Product</summary>
                <div className="admin-accordion__body">
                  <form onSubmit={handleCreateProduct}>
                    <ProductFormFields
                      form={createForm}
                      setForm={setCreateForm}
                      idPrefix="create"
                    />
                    <div className="admin-form-actions">
                      <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? "Saving…" : "Create Product"}
                      </Button>
                    </div>
                  </form>
                </div>
              </details>

              <h2 className="admin-panel__heading">All Products</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
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
                        <td colSpan={8} className="admin-table__empty">
                          No products yet.
                        </td>
                      </tr>
                    ) : (
                      products.map((prod) => (
                        <tr key={prod.id}>
                          <td>
                            <span className="admin-table__emoji">{prod.emoji}</span>
                            <strong>{prod.name}</strong>
                            <div className="admin-table__muted">{prod.price}</div>
                          </td>
                          <td>{prod.category || "—"}</td>
                          <td>Rs. {prod.unitPrice ?? "—"}</td>
                          <td>
                            <span
                              className={
                                (prod.stockCount ?? 0) <= 0
                                  ? "admin-stock admin-stock--out"
                                  : "admin-stock admin-stock--in"
                              }
                            >
                              {prod.stockCount ?? 0} {prod.unit || "kg"}
                            </span>
                          </td>
                          <td>
                            {prod.available !== false ? (
                              <span className="admin-badge admin-badge--success">Yes</span>
                            ) : (
                              <span className="admin-badge admin-badge--muted">No</span>
                            )}
                          </td>
                          <td>{prod.badge || "—"}</td>
                          <td>{prod.discountPercentage ?? 0}%</td>
                          <td>
                            <div className="admin-table__actions">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditModal(prod)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="btn--danger"
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
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-panel">
              <div className="admin-summary">
                <span>
                  <strong>Total Orders:</strong> {orders.length}
                </span>
                <span>
                  <strong>Total Revenue:</strong> Rs.{" "}
                  {totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
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
                        <td colSpan={6} className="admin-table__empty">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.name || "—"}</td>
                          <td>{order.phone || "—"}</td>
                          <td className="admin-table__small">{order.address || "—"}</td>
                          <td className="admin-table__small admin-table__nowrap">
                            {formatTimestamp(order.createdAt)}
                          </td>
                          <td className="admin-table__small">
                            {order.items?.length ? (
                              <ul className="admin-order-items">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.productName} - {item.quantity}
                                    {item.subtotal != null &&
                                      ` (Rs. ${item.subtotal})`}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="admin-table__total">
                            Rs. {order.totalBill ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "feedbacks" && (
            <div className="admin-panel">
              <div className="admin-review-grid">
                {feedbacks.length === 0 ? (
                  <p className="admin-table__empty">No reviews yet.</p>
                ) : (
                  feedbacks.map((feed) => (
                    <article
                      key={feed.id}
                      className={`admin-review-card${
                        feed.approved
                          ? " admin-review-card--approved"
                          : " admin-review-card--pending"
                      }`}
                    >
                      <div className="admin-review-card__header">
                        <h3 className="admin-review-card__name">
                          {feed.name || "Anonymous"}
                        </h3>
                        {feed.approved ? (
                          <span className="admin-badge admin-badge--success">
                            Approved
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge--warning">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="admin-review-card__stars" aria-hidden>
                        {"★".repeat(feed.rating || 0)}
                        {"☆".repeat(5 - (feed.rating || 0))}
                      </div>
                      <p className="admin-review-card__text">
                        {feed.review || feed.comment || "No comment."}
                      </p>
                      <div className="admin-review-card__actions">
                        {!feed.approved && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApproveFeedback(feed.id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn--danger"
                          onClick={() => handleDeleteFeedback(feed.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <>
          <button
            type="button"
            className="admin-modal-backdrop"
            aria-label="Close dialog"
            onClick={() => setShowEditModal(false)}
          />
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                Edit Product
                {editingProduct ? `: ${editingProduct.name}` : ""}
              </h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="admin-modal__body">
                <ProductFormFields
                  form={editForm}
                  setForm={setEditForm}
                  idPrefix="edit"
                />
              </div>
              <div className="admin-modal__footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}