import { useEffect, useState } from "react";
import { api } from "../api";

function Customers() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

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
        { documentType: "", notes: "", fileName: "" },
      ],
    });
  };

  const save = async () => {
    await api.post("/customers", form);
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
    load();
    alert("Customer saved!");
  };

  return (
    <div>
      <h2>Customer Master</h2>

      {/* BASIC INFO */}
      <div className="card">
        <h3>Basic Info</h3>
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Sales Person"
          value={form.salesPerson}
          onChange={(e) =>
            setForm({ ...form, salesPerson: e.target.value })
          }
        />
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
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.addresses];
                      arr[i].address = e.target.value;
                      setForm({ ...form, addresses: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.addresses];
                      arr[i].city = e.target.value;
                      setForm({ ...form, addresses: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.addresses];
                      arr[i].state = e.target.value;
                      setForm({ ...form, addresses: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.addresses];
                      arr[i].country = e.target.value;
                      setForm({ ...form, addresses: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.addresses];
                      arr[i].telephone = e.target.value;
                      setForm({ ...form, addresses: arr });
                    }}
                  />
                </td>
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
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.contacts];
                      arr[i].contactName = e.target.value;
                      setForm({ ...form, contacts: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.contacts];
                      arr[i].contactNumber = e.target.value;
                      setForm({ ...form, contacts: arr });
                    }}
                  />
                </td>
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
              <th>File Name</th>
            </tr>
          </thead>
          <tbody>
            {form.documents.map((d, i) => (
              <tr key={i}>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.documents];
                      arr[i].documentType = e.target.value;
                      setForm({ ...form, documents: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.documents];
                      arr[i].notes = e.target.value;
                      setForm({ ...form, documents: arr });
                    }}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) => {
                      const arr = [...form.documents];
                      arr[i].fileName = e.target.value;
                      setForm({ ...form, documents: arr });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={save}>Save Customer</button>

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
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
              </tr>
            </thead>
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
            <thead>
              <tr>
                <th>Type</th>
                <th>Notes</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {selected.documents?.map((d, i) => (
                <tr key={i}>
                  <td>{d.documentType}</td>
                  <td>{d.notes}</td>
                  <td>{d.fileName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Customers;
