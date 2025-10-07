// src/pages/contacto.jsx
import React, { useRef } from "react";
import "../assets/CSS/contacto.css";
import A11yBar from "../components/A11yBar";

export default function Contacto() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Tu mensaje ha sido enviado. Pronto nos pondremos en contacto contigo.");
    formRef.current.reset();
  };

  return (
    <main className="contact-container" lang="es">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <A11yBar />
      {/* Encabezado */}
      <section id="main-content" className="hero" tabIndex={-1} aria-labelledby="contact-title">
        <h1 id="contact-title">Contáctanos</h1>
        <p>
          Queremos escucharte. Si tienes dudas, sugerencias o necesitas apoyo, completa el formulario
          o utiliza los medios de contacto alternativos.
        </p>
      </section>

      {/* Formulario de contacto */}
      <section className="section alt" aria-labelledby="form-title">
        <h2 id="form-title">Formulario de contacto</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          {/* Nombre */}
          <label htmlFor="nombre">
            Nombre completo <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Ej: Juan Pérez"
            required
            aria-required="true"
          />

          {/* Correo */}
          <label htmlFor="correo">
            Correo electrónico <span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="Ej: usuario@correo.com"
            required
            aria-required="true"
          />

          {/* Mensaje */}
          <label htmlFor="mensaje">
            Mensaje <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            placeholder="Escribe tu mensaje aquí..."
            required
            aria-required="true"
          ></textarea>

          {/* Botón */}
          <button type="submit" className="send-btn">
            📩 Enviar mensaje
          </button>
        </form>
      </section>

      {/* Medios alternativos */}
      <section className="section" aria-labelledby="alt-contact-title">
        <h2 id="alt-contact-title">Otros medios de contacto</h2>
        <ul>
          <li>📧 Correo: <a href="mailto:soporte@knowledge.org">soporte@knowledge.org</a></li>
          <li>📱 WhatsApp: <a href="https://wa.me/573001112233" target="_blank" rel="noreferrer">+57 300 111 2233</a></li>
          <li>📍 Dirección: Calle 123 #45-67, Bogotá, Colombia</li>
        </ul>
      </section>
    </main>
  );
}
