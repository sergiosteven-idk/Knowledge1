// src/pages/informacion.jsx
import React, { useRef } from "react";
import A11yBar from "../components/A11yBar";

export default function Informacion() {
  const accesibilidadRef = useRef(null);
  const inclusionRef = useRef(null);
  const legalRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current?.focus({ preventScroll: true });
  };

  return (

    

    <main className="info-container" lang="es">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <A11yBar />
      {/* Encabezado */}
      <section id="main-content" className="hero" tabIndex={-1} aria-labelledby="info-title">
        <h1 id="info-title">
          Información clave sobre <span className="highlight">Knowledge</span>
        </h1>
        <p>
          Aquí encontrarás detalles sobre accesibilidad, inclusión digital y los aspectos legales y éticos que garantizan
          que Knowledge sea una plataforma transparente y segura para todas las personas.
        </p>

        <div className="hero-buttons" role="navigation" aria-label="Navegación interna">
          <button onClick={() => scrollTo(accesibilidadRef)} aria-label="Ir a accesibilidad">Accesibilidad</button>
          <button onClick={() => scrollTo(inclusionRef)} aria-label="Ir a inclusión">Inclusión</button>
          <button onClick={() => scrollTo(legalRef)} aria-label="Ir a aspectos legales">Legal y Ética</button>
        </div>
      </section>

      {/* Sección Accesibilidad */}
      <section ref={accesibilidadRef} className="section" tabIndex={-1}>
        <h2>Accesibilidad</h2>
        <p>
          Knowledge cumple con las pautas de accesibilidad WCAG 2.1, asegurando que cualquier persona pueda interactuar
          con la plataforma. Esto incluye compatibilidad con lectores de pantalla, navegación por teclado, subtítulos en
          videos y soporte de lenguaje de señas.
        </p>
        <ul>
          <li>Compatibilidad con NVDA, JAWS y VoiceOver.</li>
          <li>Navegación con teclado y atajos accesibles.</li>
          <li>Subtítulos y transcripciones en todos los contenidos audiovisuales.</li>
        </ul>
      </section>

      {/* Sección Inclusión */}
      <section ref={inclusionRef} className="section alt" tabIndex={-1}>
        <h2>Inclusión digital</h2>
        <p>
          Nuestro enfoque es inclusivo y culturalmente sensible. Knowledge integra recursos en distintos formatos
          (texto, audio, video, pictogramas) para llegar a comunidades diversas, incluyendo personas con discapacidad
          cognitiva, sensorial o física.
        </p>
        <ul>
          <li>Opciones de lectura simplificada.</li>
          <li>Contenido en Lengua de Señas Colombiana (LSC).</li>
          <li>Material adaptado a distintos niveles de alfabetización.</li>
        </ul>
      </section>

      {/* Sección Legal */}
      <section ref={legalRef} className="section" tabIndex={-1}>
        <h2>Aspectos legales y éticos</h2>
        <p>
          Knowledge protege la privacidad de los usuarios y cumple con las normativas de tratamiento de datos personales
          (Ley 1581 de 2012 en Colombia y GDPR en Europa). Además, promovemos la transparencia y el consentimiento informado
          en todas las interacciones.
        </p>
        <ul>
          <li>Política de privacidad clara y accesible.</li>
          <li>Consentimiento informado en el registro.</li>
          <li>Auditoría de acciones críticas y manejo ético de datos.</li>
        </ul>
      </section>
    </main>
  );
}
