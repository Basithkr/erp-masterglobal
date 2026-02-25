import { useEffect, useState } from "react";
import { api } from "../api";

function Customers() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  // OTP states
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
    setOtpVerified(false);
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

    // Upload documents
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

    // Reset
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
    alert("Customer saved!");
  };

  // ================= UI =================

  return (
    <div>
      <h2>Customer Master</h2>

      {/* BASIC INFO + OTP */}
      <div className="card">
        <h3>Basic Info</h3>

        <input placeholder="Code" value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })} />

        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setOtpVerified(false);
            setOtpSent(false);
          }}
        />

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

      {/* ADDRESSES */}
      <div className="card">
        <h3>Addresses</h3>
        <button onClick={addAddress}>+ Add Address</button>

        <table className="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Telephone</th>
            </tr>
          </thead>
          <tbody>
            {form.addresses.map((a, i) => (
              <tr key={i}>
                <td><input onChange={(e) => {
                  const arr = [...form.addresses];
                  arr[i].address = e.target.value;
                  setForm({ ...form, addresses: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.addresses];
                  arr[i].city = e.target.value;
                  setForm({ ...form, addresses: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.addresses];
                  arr[i].state = e.target.value;
                  setForm({ ...form, addresses: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.addresses];
                  arr[i].country = e.target.value;
                  setForm({ ...form, addresses: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.addresses];
                  arr[i].telephone = e.target.value;
                  setForm({ ...form, addresses: arr });
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONTACTS */}
      <div className="card">
        <h3>Contacts</h3>
        <button onClick={addContact}>+ Add Contact</button>

        <table className="table">
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {form.contacts.map((c, i) => (
              <tr key={i}>
                <td><input onChange={(e) => {
                  const arr = [...form.contacts];
                  arr[i].contactName = e.target.value;
                  setForm({ ...form, contacts: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.contacts];
                  arr[i].contactNumber = e.target.value;
                  setForm({ ...form, contacts: arr });
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DOCUMENTS */}
      <div className="card">
        <h3>Documents</h3>
        <button onClick={addDocument}>+ Add Document</button>

        <table className="table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Notes</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {form.documents.map((d, i) => (
              <tr key={i}>
                <td><input onChange={(e) => {
                  const arr = [...form.documents];
                  arr[i].documentType = e.target.value;
                  setForm({ ...form, documents: arr });
                }} /></td>
                <td><input onChange={(e) => {
                  const arr = [...form.documents];
                  arr[i].notes = e.target.value;
                  setForm({ ...form, documents: arr });
                }} /></td>
                <td><input type="file" onChange={(e) => {
                  const arr = [...form.documents];
                  arr[i].file = e.target.files[0];
                  setForm({ ...form, documents: arr });
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={save} disabled={!otpVerified}>Save Customer</button>

      {/* CUSTOMER LIST */}
      <div className="card">
        <h3>Customer List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Sales Person</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.salesPerson}</td>
                <td>
                  <button onClick={() => setSelected(c)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL DETAILS VIEW */}
      {selected && (
        <div className="card">
          <h3>Customer Full Details</h3>

          <p><b>Code:</b> {selected.code}</p>
          <p><b>Name:</b> {selected.name}</p>
          <p><b>Email:</b> {selected.email}</p>
          <p><b>Phone:</b> {selected.phone}</p>
          <p><b>Sales Person:</b> {selected.salesPerson}</p>

          <h4>Addresses</h4>
          <table className="table">
            <tbody>
              {selected.addresses?.map((a, i) => (
                <tr key={i}>
                  <td>{a.address}</td>
                  <td>{a.city}</td>
                  <td>{a.state}</td>
                  <td>{a.country}</td>
                  <td>{a.telephone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Contacts</h4>
          <table className="table">
            <tbody>
              {selected.contacts?.map((c, i) => (
                <tr key={i}>
                  <td>{c.contactName}</td>
                  <td>{c.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Documents</h4>
          <table className="table">
            <tbody>
              {selected.documents?.length > 0 ? (
                selected.documents.map((d, i) => (
                  <tr key={i}>
                    <td>{d.documentType}</td>
                    <td>{d.notes}</td>
                    <td>
                      {d.fileName ? (
                        <a
                          href={`${api.defaults.baseURL}/customers/documents/download/${d.storedFileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {d.fileName}
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No documents uploaded</td>
                </tr>
              )}
            </tbody>
          </table>

          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Customers;