import { getProducts, deleteProduct } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};
 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH PRODUCTS
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [navigate]);


  // ✅ LOGOUT
  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  // ✅ DELETE PRODUCT
  const handleDelete = async (id) => {
  try {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    console.error("Delete error:", err);
  }
};

  // ✅ KPI CALCULATIONS
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + (p.stock || 0),
    0
  );

  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0
  );

  const categories = [...new Set(products.map((p) => p.category))];

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>📊 Business Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* USER CARD */}
      <div className="user-card">
        <h2>Welcome, {user.name} 👋</h2>
        <p>{user.email}</p>
      </div>

      {/* KPI SECTION */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
        </div>

        <div className="kpi-card">
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
        </div>

        <div className="kpi-card">
          <h3>Inventory Value</h3>
          <h2>₹ {totalValue}</h2>
        </div>

        <div className="kpi-card">
          <h3>Categories</h3>
          <h2>{categories.length}</h2>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <h2>Top Products</h2>
      <ul>
        {[...products]
          .sort((a, b) => b.price * b.stock - a.price * a.stock)
          .slice(0, 3)
          .map((p) => (
            <li key={p._id}>
              {p.name} — ₹{p.price * p.stock}
            </li>
          ))}
      </ul>

      {/* TABLE */} 
      <div className="table-container">
        <h2>All Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>₹{p.price * p.stock}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;
   