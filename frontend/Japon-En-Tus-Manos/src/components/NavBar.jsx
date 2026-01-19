import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ cart, userName }) {
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.Quantity, 0);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "#e60039",
        color: "white",
        fontWeight: "bold",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/UserHome")}>
        Japon En Tus Manos
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div>Hola, {userName || "Invitado"}</div>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/user/cart")}>
          🛒 Carrito ({cartCount})
        </div>
      </div>
    </div>
  );
}

export default Navbar;
