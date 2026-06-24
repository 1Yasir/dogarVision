import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import Button from "../components/common/Button"; 

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [stockInputs, setStockInputs] = useState({});

  // 🟢 Saare Database Fields Ki States
  const [newProdName, setNewProdName] = useState("");
  const [newProdPriceString, setNewProdPriceString] = useState(""); // e.g. "Rs. 3500 / kg"
  const [newProdUnitPrice, setNewProdUnitPrice] = useState(""); // e.g. 3500
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(""); // e.g. 4000
  const [newProdDiscount, setNewProdDiscount] = useState("0");
  const [newProdUnit, setNewProdUnit] = useState("kg");
  const [newProdUnitType, setNewProdUnitType] = useState("kg");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdEmoji, setNewProdEmoji] = useState("📦");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdBadge, setNewProdBadge] = useState(""); // e.g. "New Launch" ya "Hot"
  const [newProdCategory, setNewProdCategory] = useState("dairy"); // e.g. dairy, poultry
  const [newProdImageLabel, setNewProdImageLabel] = useState(""); // e.g. "Desi Ghee"
  const [newProdDetailPath, setNewProdDetailPath] = useState(""); // e.g. "/product/ghee"

  useEffect(() => {
    const qProducts = query(collection(db, "products"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const prodList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prodList);
    });

    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordList);
    });

    const qFeedbacks = query(collection(db, "feedbacks"));
    const unsubFeedbacks = onSnapshot(qFeedbacks, (snapshot) => {
      const feedList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedList);
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubFeedbacks();
    };
  }, []);

  // 🟢 Naya Product Firestore Mein Save Karne Ka Handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdUnitPrice || !newProdStock) {
      alert("Plz Name, Unit Price aur Stock laazmi likhein!");
      return;
    }

    try {
      // Automatic detailPath aur imageLabel agar khali hon
      const formattedPath = newProdDetailPath.trim() || `/product/${newProdName.toLowerCase().replace(/\s+/g, "-")}`;
      const formattedImageLabel = newProdImageLabel.trim() || newProdName.trim();
      const formattedPriceString = newProdPriceString.trim() || `Rs. ${newProdUnitPrice} / ${newProdUnit}`;

      await addDoc(collection(db, "products"), {
        name: newProdName.trim(),
        price: formattedPriceString,
        unitPrice: Number(newProdUnitPrice),
        originalPrice: newProdOriginalPrice ? Number(newProdOriginalPrice) : Number(newProdUnitPrice),
        discountPercentage: Number(newProdDiscount),
        unit: newProdUnit.trim(),
        unitType: newProdUnitType.trim(),
        stockCount: Number(newProdStock),
        emoji: newProdEmoji.trim(),
        desc: newProdDesc.trim(),
        badge: newProdBadge.trim(),
        category: newProdCategory.trim(),
        imageLabel: formattedImageLabel,
        detailPath: formattedPath,
        available: true, // Hamesha naya product starting mein true hoga
        kgOptions: [0.5, 1, 2] // Default weight options dropdown ke liye
      });

      alert("🎉 Naya product saari fields ke sath add ho gaya!");
      
      // Form fields reset
      setNewProdName("");
      setNewProdPriceString("");
      setNewProdUnitPrice("");
      setNewProdOriginalPrice("");
      setNewProdDiscount("0");
      setNewProdUnit("kg");
      setNewProdUnitType("kg");
      setNewProdStock("");
      setNewProdEmoji("📦");
      setNewProdDesc("");
      setNewProdBadge("");
      setNewProdCategory("dairy");
      setNewProdImageLabel("");
      setNewProdDetailPath("");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Product add karne mein koi masla hua hai.");
    }
  };

  const handleStockUpdate = async (productId) => {
    const newStock = parseInt(stockInputs[productId]);
    if (isNaN(newStock) || newStock < 0) {
      alert("Plz sahi stock number likhein!");
      return;
    }
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { stockCount: newStock });
      alert("Stock kamyabi se update ho gaya!");
      setStockInputs({ ...stockInputs, [productId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveFeedback = async (id) => {
    try {
      const feedRef = doc(db, "feedbacks", id);
      await updateDoc(feedRef, { approved: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Kya aap yeh review delete karna chahte hain?")) return;
    try {
      const feedRef = doc(db, "feedbacks", id);
      await deleteDoc(feedRef);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>ℹ️ Dogar Vision - Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button className={`btn ${activeTab === 'products' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab("products")}>📦 Stock & Products</button>
        <button className={`btn ${activeTab === 'orders' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab("orders")}>🛒 Customer Orders ({orders.length})</button>
        <button className={`btn ${activeTab === 'feedbacks' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab("feedbacks")}>⭐ Reviews Approval</button>
      </div>

      {/* --- PRODUCTS TAB --- */}
      {activeTab === "products" && (
        <div>
          {/* Detailed Add Product Form */}
          <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "30px" }}>
            <h3 style={{ marginTop: 0, color: "#2e7d32" }}>➕ Add New Product (All Database Fields)</h3>
            <form onSubmit={handleAddProduct} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" }}>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Product Name:</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. Pure Desi Ghee" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Image Label (Text on Image):</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. DESI GHEE" value={newProdImageLabel} onChange={(e) => setNewProdImageLabel(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Emoji Icon:</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. 🍯, 🥚, 🍗" value={newProdEmoji} onChange={(e) => setNewProdEmoji(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Unit Price (Number only):</label>
                <input type="number" style={{ width: "100%", padding: "6px" }} placeholder="e.g. 3500" value={newProdUnitPrice} onChange={(e) => setNewProdUnitPrice(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Original Price (Before Disc.):</label>
                <input type="number" style={{ width: "100%", padding: "6px" }} placeholder="e.g. 4000" value={newProdOriginalPrice} onChange={(e) => setNewProdOriginalPrice(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Discount % (Number):</label>
                <input type="number" style={{ width: "100%", padding: "6px" }} placeholder="e.g. 15" value={newProdDiscount} onChange={(e) => setNewProdDiscount(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Price Display Text (Optional):</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. Rs. 3500 / kg" value={newProdPriceString} onChange={(e) => setNewProdPriceString(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Unit (e.g. kg / crate):</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="kg" value={newProdUnit} onChange={(e) => setNewProdUnit(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Unit Type:</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="kg" value={newProdUnitType} onChange={(e) => setNewProdUnitType(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Initial Stock Count:</label>
                <input type="number" style={{ width: "100%", padding: "6px" }} placeholder="e.g. 10" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Badge (Optional):</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. New Launch, Hot" value={newProdBadge} onChange={(e) => setNewProdBadge(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Category:</label>
                <select style={{ width: "100%", padding: "6px" }} value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)}>
                  <option value="dairy">Dairy</option>
                  <option value="poultry">Poultry</option>
                  <option value="organic">Organic</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Detail Path (Optional):</label>
                <input type="text" style={{ width: "100%", padding: "6px" }} placeholder="e.g. /product/ghee" value={newProdDetailPath} onChange={(e) => setNewProdDetailPath(e.target.value)} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Product Description:</label>
                <textarea style={{ width: "100%", padding: "6px" }} rows={2} placeholder="Traditional homemade desi ghee prepared using the bilona method..." value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} />
              </div>

              <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
                <Button variant="accent" type="submit">🚀 Save Complete Product</Button>
              </div>
            </form>
          </div>

          <h2>Product Stock Control</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }} border="1" cellPadding="10">
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th>Item</th>
                <th>Current Stock</th>
                <th>New Stock Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id}>
                  <td><span style={{fontSize: '1.3rem'}}>{prod.emoji}</span> {prod.name}</td>
                  <td style={{ fontWeight: "bold", color: prod.stockCount <= 0 ? "red" : "green" }}>
                    {prod.stockCount} {prod.unit || 'kg'}
                  </td>
                  <td>
                    <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      style={{ padding: "5px", width: "80px" }}
                      value={stockInputs[prod.id] || ""}
                      onChange={(e) => setStockInputs({ ...stockInputs, [prod.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <Button variant="primary" type="button" onClick={() => handleStockUpdate(prod.id)}>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ORDERS TAB --- */}
      {activeTab === "orders" && (
        <div>
          <h2>Recent Orders Log</h2>
          {orders.length === 0 ? <p>Abhi tak koi order nahi aya.</p> : (
            <div style={{ display: "grid", gap: "15px", marginTop: "15px" }}>
              {orders.map(order => (
                <div key={order.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                  <p><strong>Customer:</strong> {order.name} ({order.phone})</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Date:</strong> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "Just now"}</p>
                  <div style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #eee", marginTop: "5px" }}>
                    <strong>Ordered Items:</strong>
                    <ul>
                      {order.items?.map((item, idx) => (
                        <li key={idx}>{item.productName} — {item.quantity} (Subtotal: Rs. {item.subtotal})</li>
                      ))}
                    </ul>
                    <p style={{ margin: "5px 0 0 0", color: "#2e7d32", fontWeight: "bold" }}>Total Bill: Rs. {order.totalBill}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- REVIEWS TAB --- */}
      {activeTab === "feedbacks" && (
        <div>
          <h2>Customer Reviews Management</h2>
          <div style={{ display: "grid", gap: "15px", marginTop: "15px" }}>
            {feedbacks.map(feed => (
              <div key={feed.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: feed.approved ? "#e8f5e9" : "#fffde7" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0" }}><strong>{feed.name}</strong> {feed.approved ? "✅ Approved" : "⏳ Pending Approval"}</p>
                  <p style={{ margin: "0 0 5px 0", color: "#fbc02d" }}>{"⭐".repeat(feed.rating || 5)}</p>
                  <p style={{ margin: "0", color: "#555" }}>"{feed.comment || feed.review}"</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {!feed.approved && (
                    <Button variant="accent" type="button" onClick={() => handleApproveFeedback(feed.id)}>Approve</Button>
                  )}
                  <button className="btn btn--outline" style={{ borderColor: "red", color: "red" }} onClick={() => handleDeleteFeedback(feed.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}   