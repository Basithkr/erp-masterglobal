import { useEffect, useState } from "react";
import { api } from "../api";

function Orders() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/orders").then(res => setList(res.data));
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Total Sale</th>
              <th>Total Cost</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>{o.customerName}</td>
                <td>{o.totalSale}</td>
                <td>{o.totalCost}</td>
                <td>{o.netAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
