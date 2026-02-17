import { useEffect, useState } from "react";
import { api } from "../api";

function Customers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const load = async () => {
    const res = await api.get("/customers");
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setError("");
    try {
      await api.post("/customers", form);
      setForm({ code: "", name: "", email: "", phone: "" });
      load();
    } catch (e) {
      setError(e.response?.data?.error || "Save failed");
    }
  };

  return (
    <div>
      <h2>Customer Master</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <input placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={save}>Save Customer</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
