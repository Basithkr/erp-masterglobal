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
      <h2>Order Details</h2>

      {/* HEADER */}
      <div className="card">
        <p><b>Order No:</b> {order.orderNumber}</p>
        <p><b>Order Date:</b> {order.orderDate}</p>
        <p><b>Execution Date:</b> {order.executionDate}</p>
        <p><b>Customer:</b> {order.customerName}</p>
      </div>

      {/* CHARGES TABLE */}
      <div className="card">
        <h3>Charges (Sale & Cost)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Charge Code</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Cost</th>
              <th>Sale Value</th>
              <th>Cost Value</th>
              <th>VAT %</th>
              <th>VAT Sale</th>
              <th>VAT Cost</th>
              <th>Total Sale</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {order.charges?.map((c, i) => (
              <tr key={i}>
                <td>{c.billNumber}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="card">
        <p><b>Total Sale:</b> {order.totalSale}</p>
        <p><b>Total Cost:</b> {order.totalCost}</p>
        <p><b>Net:</b> {order.netAmount}</p>
      </div>
    </div>
  );
}

export default ViewOrder;
