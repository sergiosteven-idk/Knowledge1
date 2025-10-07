// src/pages/adminZone/AdminProfile.jsx
import { useState } from "react";
import "../../assets/CSS/dashboard_styles.css";

export default function AdminProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [nombre, setNombre] = useState(storedUser.nombre || "");
  const [apellido, setApellido] = useState(storedUser.apellido || "");
  const [email, setEmail] = useState(storedUser.correo || "");

  const guardar = (e) => {
    e.preventDefault();
    const updatedUser = { ...storedUser, nombre, apellido, correo: email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Perfil actualizado (localStorage)");
  };

  return (
    <div className="dashboard-container">
      <h1>Mi Perfil</h1>
      <form onSubmit={guardar}>
        <div className="form-group">
          <label>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Apellido</label>
          <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Correo</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">💾 Guardar</button>
      </form>
    </div>
  );
}
