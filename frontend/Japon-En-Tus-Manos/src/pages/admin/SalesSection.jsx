import React, { useEffect, useState } from "react";
import { getSales } from "../../services/sales";
import "../../styles/SalesSection.css";

function SalesSection() {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar ventas");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="sales-section">
  {sales.map((sale) => (
    <div key={sale.SaleID} className="sale-card">
      <h3>Venta #{sale.SaleID}</h3>
      <div className="sale-info">
        <p>Usuario: {sale.UserID}</p>
        <p>Total: ${sale.Total}</p>
        <p>Estado: {sale.PaymentStatus}</p>
        <p>Método: {sale.PaymentMethod}</p>
      </div>
      <div className="sale-items">
        {sale.Items && sale.Items.map((item) => (
          <div key={item.SaleItemID} className="sale-item">
            Producto {item.ProductID} x {item.Quantity} - ${item.UnitPrice}
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

  );
}

export default SalesSection;
