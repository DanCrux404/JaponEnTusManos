import React, { useState } from "react";
import AdminsSection from "./AdminsSection.jsx";
import UsersSection from "./UsersSection.jsx";
import ProductsSection from "./ProductsSection.jsx";
import SalesSection from "./SalesSection.jsx";
import "../../styles/AdminDashboard.css";
import AdminChat from "../../components/AdminChat.jsx"


function Dashboard() {
    const [section, setSection] = useState("admins");

  return (
    <div>
      
      {/* Menú de navegación */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <button className="admin-button" onClick={() => setSection("admins")}>Admins</button>
        <button className="admin-button" onClick={() => setSection("users")}>Usuarios</button>
        <button className="admin-button" onClick={() => setSection("products")}>Productos</button>
        <button className="admin-button" onClick={() => setSection("sales")}>Ventas</button>
        <button className="admin-button" onClick={() => setSection("chat")}>Chat</button>
      </div>

      {/* Secciones */}
      <div style={{ marginTop: "30px" }}>
        {section === "admins" && <AdminsSection />}
        {section === "users" && <UsersSection />}
        {section === "products" && <ProductsSection />}
        {section === "sales" && <SalesSection />}
        {section === "chat" && <AdminChat/>}
      </div>
    </div>
  );
}

export default Dashboard;