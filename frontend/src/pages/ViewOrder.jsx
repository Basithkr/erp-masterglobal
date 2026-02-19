import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

function ViewOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data));
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order Entry</h2>

      {/* ================= HEADER ================= */}
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <p><b>Order Type:</b> Normal</p>
          <p><b>Customer Name:</b> {order.customerName}</p>

          <p><b>Order Number:</b> {order.orderNumber}</p>
          <p><b>Customer Executive:</b> -</p>

          <p><b>Order Date:</b> {order.orderDate}</p>
          <p></p>

          <p><b>Order Execution:</b> {order.executionDate}</p>
        </div>
      </div>

      {/* ================= BL DETAILS ================= */}
      <div className="card">
        <h3>BL Details</h3>
        <table className="table">
          <thead>
            <tr>
              <th>BL Number</th>
              <th>BL Marks</th>
              <th>BL Description</th>
              <th>BL Qty</th>
              <th>BL Weight</th>
              <th>BL Volume</th>
            </tr>
          </thead>
          <tbody>
            {order.details?.length > 0 ? (
              order.details.map((d, i) => (
                <tr key={i}>
                  <td>{d.billOfLadingNo}</td>
                  <td>{d.marks}</td>
                  <td>{d.description}</td>
                  <td>{d.qty}</td>
                  <td>{d.weight}</td>
                  <td>{d.volume}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No BL details</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CONTAINER DETAILS ================= */}
      <div className="card">
        <h3>Container Details</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Container Seal</th>
              <th>Container Weight</th>
            </tr>
          </thead>
          <tbody>
            {order.containers?.length > 0 ? (
              order.containers.map((c, i) => (
                <tr key={i}>
                  <td>{c.containerNumber}</td>
                  <td>{c.sealNumber}</td>
                  <td>{c.weight}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No containers</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CHARGES ================= */}
      <div className="card">
        <h3>Charges (Sale & Cost)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Charge Code</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Cost</th>
              <th>Sale Value</th>
              <th>Cost Value</th>
              <th>VAT %</th>
              <th>VAT Value Sales</th>
              <th>VAT Value Cost</th>
              <th>Total Sale</th>
              <th>Total Cost Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.charges?.length > 0 ? (
              order.charges.map((c, i) => (
                <tr key={i}>
                  <td>{c.chargeCode}</td>
                  <td>{c.qty}</td>
                  <td>{c.saleRate}</td>
                  <td>{c.costRate}</td>
                  <td>{c.saleAmount}</td>
                  <td>{c.costAmount}</td>
                  <td>{c.vatPercent}</td>
                  <td>{c.vatSale}</td>
                  <td>{c.vatCost}</td>
                  <td>{c.totalSale}</td>
                  <td>{c.totalCost}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No charges</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= TOTALS ================= */}
      <div className="card">
        <p><b>Total Sale:</b> {order.totalSale}</p>
        <p><b>Total Cost:</b> {order.totalCost}</p>
        <p><b>Net Amount:</b> {order.netAmount}</p>
      </div>
    </div>
  );
}

export default ViewOrder;
