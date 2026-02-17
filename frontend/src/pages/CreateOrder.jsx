import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function CreateOrder() {
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    orderNumber: "",
    orderDate: "",
    executionDate: "",
    customerCode: "",
    customerName: "",
    charges: [],
  });

  const addCharge = () => {
    setOrder({
      ...order,
      charges: [
        ...order.charges,
        {
          billNumber: "",
          chargeCode: "",
          qty: 1,
          saleRate: 0,
          costRate: 0,
          vatPercent: 5,
        },
      ],
    });
  };

  const updateCharge = (index, field, value) => {
    const newCharges = [...order.charges];
    newCharges[index][field] = value;
    setOrder({ ...order, charges: newCharges });
  };

  const removeCharge = (index) => {
    const newCharges = order.charges.filter((_, i) => i !== index);
    setOrder({ ...order, charges: newCharges });
  };

  const saveOrder = async () => {
    try {
        const payload = {
        ...order,
        orderDate: order.orderDate || null,
        executionDate: order.executionDate || null,
        };

        console.log("SENDING ORDER:", payload);

        await api.post("/orders", payload);
        alert("Order saved successfully!");
        navigate("/orders");
    } catch (e) {
        console.error("SAVE ERROR:", e.response || e);
        alert(e.response?.data?.error || "Failed to save order");
    }
  };


  return (
    <div>
      <h2>Create Order</h2>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <input
            placeholder="Order Number"
            value={order.orderNumber}
            onChange={(e) => setOrder({ ...order, orderNumber: e.target.value })}
          />
          <input
            type="date"
            value={order.orderDate}
            onChange={(e) => setOrder({ ...order, orderDate: e.target.value })}
          />
          <input
            type="date"
            value={order.executionDate}
            onChange={(e) => setOrder({ ...order, executionDate: e.target.value })}
          />
          <input
            placeholder="Customer Code"
            value={order.customerCode}
            onChange={(e) => setOrder({ ...order, customerCode: e.target.value })}
          />
          <input
            placeholder="Customer Name"
            value={order.customerName}
            onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
          />
        </div>
      </div>

      <div className="card">
        <h3>Charges</h3>
        <button onClick={addCharge}>+ Add Charge</button>

        <table className="table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Charge Code</th>
              <th>Qty</th>
              <th>Sale Rate</th>
              <th>Cost Rate</th>
              <th>VAT %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {order.charges.map((c, i) => (
              <tr key={i}>
                <td>
                  <input value={c.billNumber} onChange={(e) => updateCharge(i, "billNumber", e.target.value)} />
                </td>
                <td>
                  <input value={c.chargeCode} onChange={(e) => updateCharge(i, "chargeCode", e.target.value)} />
                </td>
                <td>
                  <input type="number" value={c.qty} onChange={(e) => updateCharge(i, "qty", +e.target.value)} />
                </td>
                <td>
                  <input type="number" value={c.saleRate} onChange={(e) => updateCharge(i, "saleRate", +e.target.value)} />
                </td>
                <td>
                  <input type="number" value={c.costRate} onChange={(e) => updateCharge(i, "costRate", +e.target.value)} />
                </td>
                <td>
                  <input type="number" value={c.vatPercent} onChange={(e) => updateCharge(i, "vatPercent", +e.target.value)} />
                </td>
                <td>
                  <button onClick={() => removeCharge(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={saveOrder}>💾 Save Order</button>
    </div>
  );
}

export default CreateOrder;
