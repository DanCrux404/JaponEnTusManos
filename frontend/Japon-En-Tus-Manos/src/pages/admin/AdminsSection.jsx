import React, { useEffect, useState } from "react";
import { getAdmins, createAdmin } from "../../services/admin.js";
import "../../styles/AdminsSection.css";

function AdminsSection() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ Name: "", PasswordHash: "" });

  // Cargar admins
  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Crear admin
  const handleCreate = async () => {
    if (!formData.Name || !formData.PasswordHash) {
      return alert("Todos los campos son requeridos");
    }

    try {
      await createAdmin(formData);
      alert("Admin creado 🎉");
      setFormData({ Name: "", PasswordHash: "" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Error al crear admin");
    }
  };

  return (
    <div className="admins-section">
      <h2>Admins</h2>

      {/* Lista de admins */}
      <div className="admins-list">
        {admins.length > 0 ? (
          admins.map((a) => (
            <div key={a.UserID} className="admin-card">
              <p><strong>{a.Name}</strong></p>
              <p>{a.Email}</p>
            </div>
          ))
        ) : (
          <p>No hay admins registrados</p>
        )}
      </div>

      {/* Formulario para crear admin */}
      <div className="admin-form">
        <h3>Crear Admin</h3>
        <input
          type="text"
          name="Name"
          placeholder="Nombre"
          value={formData.Name}
          onChange={handleChange}
        />
        <input
          type="password"
          name="PasswordHash"
          placeholder="Contraseña"
          value={formData.PasswordHash}
          onChange={handleChange}
        />
        <button onClick={handleCreate}>Crear Admin</button>
      </div>
    </div>
  );
}

export default AdminsSection;
