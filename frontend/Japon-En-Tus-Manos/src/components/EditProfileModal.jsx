import React from "react";
import "../styles/EditProfileModal.css";

function EditProfileModal({ formData, onChange, onSave, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Editar perfil</h2>

                <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={onChange}
                    placeholder="Nombre"
                />

                <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={onChange}
                    placeholder="Correo"
                />

                <input
                    type="text"
                    name="Location"
                    value={formData.Location}
                    onChange={onChange}
                    placeholder="Ubicación"
                />

                <label>Nueva contraseña:</label>
                <input
                    type="password"
                    name="PasswordHash"
                    placeholder="Deja vacío para no cambiar"
                    value={formData.PasswordHash || ""}
                    onChange={onChange}
                />

                <div className="modal-buttons">
                    <button className="save" onClick={onSave}>
                        Guardar
                    </button>
                    <button className="cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfileModal;
