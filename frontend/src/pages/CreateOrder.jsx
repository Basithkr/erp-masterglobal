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

  const [errors, setErrors] = useState({});

  // -------- VALIDATION ----------
  const validate = () => {
    const newErrors = {};

    if (!order.orderNumber.trim()) {
      newErrors.orderNumber = "Order Number is required";
    }

    if (!order.customerCode.trim()) {
      newErrors.customerCode = "Customer Code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------- BL DETAILS ----------
  const addDetail = () => {
    setOrder({
      ...order,
      details: [
        ...order.details,
        {
          billOfLadingNo: "",
          marks: "",
          description: "",
          qty: 0,
          weight: 0,
          volume: 0,
        },
      ],
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
      containers: [
        ...order.containers,
        {
          billNumber: "",
          containerNumber: "",
          sealNumber: "",
          weight: 0,
        },
      ],
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

  const updateCharge = (i, field, value) => {
    const arr = [...order.charges];
    arr[i][field] = value;
    setOrder({ ...order, charges: arr });
  };

  // -------- LIVE TOTAL CALCULATIONS ----------
  const totals = order.charges.reduce(
    (acc, c) => {
      const qty = c.qty || 0;
      const saleRate = c.saleRate || 0;
      const costRate = c.costRate || 0;
      const vat = c.vatPercent || 0;

      const saleAmount = qty * saleRate;
      const costAmount = qty * costRate;

      const vatSale = (saleAmount * vat) / 100;
      const vatCost = (costAmount * vat) / 100;

      acc.totalSale += saleAmount + vatSale;
      acc.totalCost += costAmount + vatCost;

      return acc;
    },
    { totalSale: 0, totalCost: 0 }
  );

  const netAmount = totals.totalSale - totals.totalCost;

  // -------- SAVE ----------
  const saveOrder = async () => {
    if (!validate()) return;

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

      {/* HEADER */}
      <div className="card">
        <div>
          <label>Order Number</label>
          <input
            placeholder="Order Number"
            value={order.orderNumber}
            onChange={(e) =>
              setOrder({ ...order, orderNumber: e.target.value })
            }
          />
          {errors.orderNumber && (
            <small style={{ color: "red" }}>{errors.orderNumber}</small>
          )}
        </div>

        <div>
          <label>Order Date</label>
          <input
            type="date"
            value={order.orderDate}
            onChange={(e) =>
              setOrder({ ...order, orderDate: e.target.value })
            }
          />
        </div>

        <div>
          <label>Execution Date</label>
          <input
            type="date"
            value={order.executionDate}
            onChange={(e) =>
              setOrder({ ...order, executionDate: e.target.value })
            }
          />
        </div>

        <div>
          <label>Customer Code</label>
          <input
            placeholder="Customer Code"
            value={order.customerCode}
            onChange={(e) =>
              setOrder({ ...order, customerCode: e.target.value })
            }
          />
          {errors.customerCode && (
            <small style={{ color: "red" }}>{errors.customerCode}</small>
          )}
        </div>

        <div>
          <label>Customer Name</label>
          <input
            placeholder="Customer Name"
            value={order.customerName}
            onChange={(e) =>
              setOrder({ ...order, customerName: e.target.value })
            }
          />
        </div>
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

      {/* TOTAL PREVIEW */}
      <div className="card">
        <h3>Order Summary</h3>
        <p><b>Total Sale:</b> {totals.totalSale.toFixed(2)}</p>
        <p><b>Total Cost:</b> {totals.totalCost.toFixed(2)}</p>
        <p><b>Net Amount:</b> {netAmount.toFixed(2)}</p>
      </div>

      <button onClick={saveOrder}>💾 Save Order</button>
    </div>
  );
}

export default CreateOrder;
