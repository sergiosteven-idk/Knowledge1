import { Link } from "react-router-dom";
import "../assets/CSS/styles.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo + nombre */}
        <div className="footer-left">
          <h2 className="footer-logo">Knowledge</h2>
          <p>Construyendo un mundo más inclusivo 🌍</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-links">
          <h3>Enlaces</h3>
          <Link to="/">🏠 Inicio</Link>
          <Link to="/discapacidad">♿ Discapacidad</Link>
          <Link to="/informacion">📋 Información</Link>
          <Link to="/contacto">📞 Contacto</Link>
        </div>

        {/* Redes sociales */}
        <div className="footer-socials">
          <h3>Síguenos</h3>
          <a href="#" target="_blank" rel="noreferrer">👍 Facebook</a>
          <a href="#" target="_blank" rel="noreferrer">🐦 Twitter</a>
          <a href="#" target="_blank" rel="noreferrer">📸 Instagram</a>
        </div>

        {/* Contacto rápido */}
        <div className="footer-contact">
          <h3>Contacto</h3>
          <p>📧 contacto@knowledge.com</p>
          <p>📱 WhatsApp: +57 300 000 0000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Knowledge | Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
