import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/customers");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "120px auto" }}>
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <input
              style={{ width: "100%" }}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              style={{ width: "100%" }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={{ width: "100%" }} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
