// src/pages/adminZone/Dashboard.jsx
import { Link } from "react-router-dom";
import "../../assets/CSS/dashboard_styles.css";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <h1>Panel de Administración</h1>
      <p>
        Bienvenido,{" "}
        <strong>
          {user ? `${user.nombre} ${user.apellido}` : "Admin"}
        </strong>
      </p>

      {/* Estadísticas rápidas */}
      <section className="section">
        <h2>Resumen</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Usuarios</h3>
            <p>15</p>
          </div>
          <div className="stat-card">
            <h3>Archivos</h3>
            <p>8</p>
          </div>
          <div className="stat-card">
            <h3>Administradores</h3>
            <p>2</p>
          </div>
        </div>
      </section>

      {/* Enlaces rápidos */}
      <section className="section">
        <h2>Gestión rápida</h2>
        <div className="dashboard-links">
          <Link to="/admin/manage-users">👥 Usuarios</Link>
          <Link to="/admin/upload-files">📂 Archivos</Link>
          <Link to="/admin/profile">⚙️ Perfil</Link>
          <Link to="/admin/user-cards">🗂 Tarjetas</Link>
        </div>
      </section>
    </div>
  );
}
