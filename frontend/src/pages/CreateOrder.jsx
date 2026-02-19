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
    details: [],
    containers: [],
    charges: [],
  });

  // -------- BL DETAILS ----------
  const addDetail = () => {
    setOrder({
      ...order,
      details: [...order.details, {
        billOfLadingNo: "",
        marks: "",
        description: "",
        qty: 0,
        weight: 0,
        volume: 0,
      }]
    });
  };

  const updateDetail = (i, field, value) => {
    const arr = [...order.details];
    arr[i][field] = value;
    setOrder({ ...order, details: arr });
  };

  // -------- CONTAINERS ----------
  const addContainer = () => {
    setOrder({
      ...order,
      containers: [...order.containers, {
        billNumber: "",
        containerNumber: "",
        sealNumber: "",
        weight: 0,
      }]
    });
  };

  const updateContainer = (i, field, value) => {
    const arr = [...order.containers];
    arr[i][field] = value;
    setOrder({ ...order, containers: arr });
  };

  // -------- CHARGES ----------
  const addCharge = () => {
    setOrder({
      ...order,
      charges: [
        ...order.charges,
        { billNumber: "", chargeCode: "", qty: 1, saleRate: 0, costRate: 0, vatPercent: 5 },
      ],
    });
  };

  const updateCharge = (i, field, value) => {
    const arr = [...order.charges];
    arr[i][field] = value;
    setOrder({ ...order, charges: arr });
  };

  const saveOrder = async () => {
    try {
      await api.post("/orders", order);
      alert("Order saved successfully!");
      navigate("/orders");
    } catch (e) {
      alert("Failed to save order");
    }
  };

  return (
    <div>
      <h2>Create Order</h2>

      <div className="card">
        <input placeholder="Order Number" value={order.orderNumber}
          onChange={e => setOrder({ ...order, orderNumber: e.target.value })} />
        <input type="date" value={order.orderDate}
          onChange={e => setOrder({ ...order, orderDate: e.target.value })} />
        <input type="date" value={order.executionDate}
          onChange={e => setOrder({ ...order, executionDate: e.target.value })} />
        <input placeholder="Customer Code" value={order.customerCode}
          onChange={e => setOrder({ ...order, customerCode: e.target.value })} />
        <input placeholder="Customer Name" value={order.customerName}
          onChange={e => setOrder({ ...order, customerName: e.target.value })} />
      </div>

      {/* BL DETAILS */}
      <div className="card">
        <h3>BL Details</h3>
        <button onClick={addDetail}>+ Add BL</button>
        {order.details.map((d, i) => (
          <div key={i}>
            <input placeholder="BL No" onChange={e => updateDetail(i,"billOfLadingNo",e.target.value)} />
            <input placeholder="Marks" onChange={e => updateDetail(i,"marks",e.target.value)} />
            <input placeholder="Desc" onChange={e => updateDetail(i,"description",e.target.value)} />
            <input type="number" placeholder="Qty" onChange={e => updateDetail(i,"qty",+e.target.value)} />
            <input type="number" placeholder="Weight" onChange={e => updateDetail(i,"weight",+e.target.value)} />
            <input type="number" placeholder="Volume" onChange={e => updateDetail(i,"volume",+e.target.value)} />
          </div>
        ))}
      </div>

      {/* CONTAINERS */}
      <div className="card">
        <h3>Containers</h3>
        <button onClick={addContainer}>+ Add Container</button>
        {order.containers.map((c, i) => (
          <div key={i}>
            <input placeholder="Bill No" onChange={e => updateContainer(i,"billNumber",e.target.value)} />
            <input placeholder="Container No" onChange={e => updateContainer(i,"containerNumber",e.target.value)} />
            <input placeholder="Seal No" onChange={e => updateContainer(i,"sealNumber",e.target.value)} />
            <input type="number" placeholder="Weight" onChange={e => updateContainer(i,"weight",+e.target.value)} />
          </div>
        ))}
      </div>

      {/* CHARGES */}
      <div className="card">
        <h3>Charges</h3>
        <button onClick={addCharge}>+ Add Charge</button>
        {order.charges.map((c, i) => (
          <div key={i}>
            <input placeholder="Bill No" onChange={e => updateCharge(i,"billNumber",e.target.value)} />
            <input placeholder="Charge Code" onChange={e => updateCharge(i,"chargeCode",e.target.value)} />
            <input type="number" placeholder="Qty" onChange={e => updateCharge(i,"qty",+e.target.value)} />
            <input type="number" placeholder="Sale Rate" onChange={e => updateCharge(i,"saleRate",+e.target.value)} />
            <input type="number" placeholder="Cost Rate" onChange={e => updateCharge(i,"costRate",+e.target.value)} />
            <input type="number" placeholder="VAT %" onChange={e => updateCharge(i,"vatPercent",+e.target.value)} />
          </div>
        ))}
      </div>

      <button onClick={saveOrder}>💾 Save Order</button>
    </div>
  );
}

export default CreateOrder;
