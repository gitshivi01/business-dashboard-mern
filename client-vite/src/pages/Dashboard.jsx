import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, logoutUser } from "../services/api";
import "../styles/dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH PRODUCTS (runs once)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const res = await axios.get("http://localhost:5002/api/products", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProducts(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // ❗ empty dependency = run once only

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5002/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // KPI
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0
  );

  const categories = [...new Set(products.map((p) => p.category))];

  const categoryData = categories.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    return {
      category: cat,
      stock: items.reduce((s, i) => s + (i.stock || 0), 0),
      value: items.reduce((s, i) => s + (i.price || 0) * (i.stock || 0), 0)
    };
  });

  const topProducts = [...products]
    .sort((a, b) => b.price * b.stock - a.price * a.stock)
    .slice(0, 3);

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Business Analytics Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="user-card">
        <h2>Welcome, {user.name} 👋</h2>
        <p>{user.email}</p>
      </div>

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

      {products.length > 0 && (
        <>
          <h2>Category Analytics</h2>

          <BarChart width={500} height={250} data={categoryData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" />
          </BarChart>

          <PieChart width={400} height={250}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="category"
              outerRadius={80}
            />
          </PieChart>
        </>
      )}

      <h2>Top Products</h2>
      <ul>
        {topProducts.map((p) => (
          <li key={p._id}>
            {p.name} — ₹{p.price * p.stock}
          </li>
        ))}
      </ul>

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
