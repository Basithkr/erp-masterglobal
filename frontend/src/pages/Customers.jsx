import { useEffect, useState } from "react";
import { api } from "../api";

function Customers() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    email: "",
    phone: "",
    salesPerson: "",
    addresses: [],
    contacts: [],
    documents: [],
  });

  const load = async () => {
    const res = await api.get("/customers");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // ================= OTP =================

  const sendOtp = async () => {
    if (!form.email) {
      alert("Enter email first");
      return;
    }
    await api.post(`/otp/send?email=${form.email}`);
    setOtpSent(true);
    alert("OTP sent to email");
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }
    await api.post(`/otp/verify?email=${form.email}&otp=${otp}`);
    setOtpVerified(true);
    alert("OTP verified successfully");
  };

  // ================= FORM HELPERS =================

  const addAddress = () => {
    setForm({
      ...form,
      addresses: [
        ...form.addresses,
        { address: "", city: "", state: "", country: "", telephone: "" },
      ],
    });
  };

  const addContact = () => {
    setForm({
      ...form,
      contacts: [...form.contacts, { contactName: "", contactNumber: "" }],
    });
  };

  const addDocument = () => {
    setForm({
      ...form,
      documents: [
        ...form.documents,
        { documentType: "", notes: "", file: null },
      ],
    });
  };

  // ================= SAVE =================

  const save = async () => {
    if (!otpVerified) {
      alert("Please verify OTP before saving customer");
      return;
    }

    // 1. Save customer (without files)
    const customerPayload = {
      code: form.code,
      name: form.name,
      email: form.email,
      phone: form.phone,
      salesPerson: form.salesPerson,
      addresses: form.addresses,
      contacts: form.contacts,
      documents: [],
    };

    const res = await api.post("/customers", customerPayload);
    const savedCustomer = res.data;

    // 2. Upload documents
    for (const d of form.documents) {
      if (d.file) {
        const fd = new FormData();
        fd.append("documentType", d.documentType);
        fd.append("notes", d.notes);
        fd.append("file", d.file);

        await api.post(
          `/customers/${savedCustomer.id}/documents/upload`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
    }

    // 3. Reset
    setForm({
      code: "",
      name: "",
      email: "",
      phone: "",
      salesPerson: "",
      addresses: [],
      contacts: [],
      documents: [],
    });
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);

    load();
    alert("Customer saved and email sent via Gmail API!");
  };

  // ================= UI =================

  return (
    <div>
      <h2>Customer Master</h2>

      <div className="card">
        <h3>Basic Info</h3>

        <input placeholder="Code" value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })} />

        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email" value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setOtpVerified(false);
            setOtpSent(false);
          }} />

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button onClick={sendOtp}>Send OTP</button>
          {otpSent && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}
        </div>

        {otpVerified && <p style={{ color: "green" }}>✅ Email Verified</p>}

        <input placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <input placeholder="Sales Person" value={form.salesPerson}
          onChange={(e) => setForm({ ...form, salesPerson: e.target.value })} />
      </div>

      {/* बाकी sections (Addresses, Contacts, Documents, List, View) */}
      {/* 👇 Keep your existing code BELOW this unchanged */}

      {/* Just replace your Save button */}
      <button onClick={save} disabled={!otpVerified}>
        Save Customer
      </button>

    </div>
  );
}

export default Customers;