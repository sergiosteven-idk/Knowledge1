// src/pages/adminZone/Uploadfiles.jsx
import { useState } from "react";
import "../../assets/CSS/dashboard_styles.css";

export default function Uploadfiles() {
  const [file, setFile] = useState(null);

  const subirArchivo = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }
    // Aquí se haría la petición al backend con FormData
    alert(`Archivo "${file.name}" subido (simulado)`);
  };

  return (
    <div className="dashboard-container">
      <h1>Gestión de Archivos</h1>
      <form onSubmit={subirArchivo}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          aria-label="Seleccionar archivo"
        />
        <button type="submit">📤 Subir</button>
      </form>
    </div>
  );
}
