import { useEffect, useState } from "react";
import { api } from "../api";

function Reports() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/orders/report/summary").then(res => setList(res.data));
  }, []);

  const exportExcel = async () => {
    const res = await api.get("/orders/report/export/excel", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "order-summary.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  const exportXml = async () => {
    const res = await api.get("/orders/report/export/xml", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "order-summary.xml");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h2>Order Summary Report</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <button onClick={exportExcel}>📊 Export Excel</button>{" "}
        <button onClick={exportXml}>📄 Export XML</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Exec Date</th>
              <th>Customer</th>
              <th>Total Sales</th>
              <th>Total Cost</th>
              <th>Sale VAT</th>
              <th>Cost VAT</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={i}>
                <td>{r.orderNumber}</td>
                <td>{r.executionDate}</td>
                <td>{r.customerName}</td>
                <td>{r.totalSales}</td>
                <td>{r.totalCost}</td>
                <td>{r.totalSaleVat}</td>
                <td>{r.totalCostVat}</td>
                <td>{r.netAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
