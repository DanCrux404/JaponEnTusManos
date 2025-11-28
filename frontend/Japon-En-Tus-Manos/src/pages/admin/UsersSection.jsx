import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/users";
import "../../styles/UsersSection.css";

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ Name: "", Email: "", Location: "", PasswordHash: "" });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.Name || !formData.Email || !formData.Location) {
      return alert("Todos los campos son requeridos");
    }

    try {
      if (editingUserId) {
        await updateUser({ UserID: editingUserId, ...formData });
        alert("Usuario actualizado 🎉");
        setEditingUserId(null);
      } else {
        await createUser(formData);
        alert("Usuario creado 🎉");
      }
      setFormData({ Name: "", Email: "", Location: "", PasswordHash: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (user) => {
    setFormData({ Name: user.Name, Email: user.Email, Location: user.Location, PasswordHash: "" });
    setEditingUserId(user.UserID);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="users-section">
      <h2>Usuarios</h2>

      <div className="users-list">
        {users.length > 0 ? (
          users.map((u) => (
            <div key={u.UserID} className="user-card">
              <p><strong>{u.Name}</strong></p>
              <p>{u.Email}</p>
              <p>{u.Location}</p>
              <div className="user-card-buttons">
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u.UserID)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay usuarios registrados</p>
        )}
      </div>

      <div className="user-form">
        <h3>{editingUserId ? "Editar Usuario" : "Crear Usuario"}</h3>
        <input
          type="text"
          name="Name"
          placeholder="Nombre"
          value={formData.Name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="Email"
          placeholder="Correo"
          value={formData.Email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Location"
          placeholder="Ubicación"
          value={formData.Location}
          onChange={handleChange}
        />
        <input
          type="password"
          name="PasswordHash"
          placeholder="Contraseña"
          value={formData.PasswordHash}
          onChange={handleChange}
        />
        <button onClick={handleCreateOrUpdate}>
          {editingUserId ? "Actualizar Usuario" : "Crear Usuario"}
        </button>
      </div>
    </div>
  );
}

export default UsersSection;
