import { Link, Outlet, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        background: "#0f172a",
        color: "#e5e7eb",
        padding: 20
      }}>
        <h2 style={{ color: "white", marginBottom: 24 }}>MasterGlobal ERP</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link to="/customers">Customer Master</Link>
          <Link to="/create-order">Create Order</Link>
          <Link to="/orders">Order Preparation</Link>
          <Link to="/reports">Reports</Link>
        </nav>

        <button
          style={{ marginTop: 30, background: "#334155" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
