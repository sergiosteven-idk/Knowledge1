// src/pages/Discapacidad.jsx
import React, { useRef } from "react";
import A11yBar from "../components/A11yBar";

export default function Discapacidad() {
  const barriersRef = useRef(null);
  const solutionsRef = useRef(null);
  const rightsRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current?.focus({ preventScroll: true });
  };

  const talkbackIntro = () => {
    const text = `Sección de discapacidad. Conoce las barreras más comunes, 
    las soluciones accesibles y los derechos fundamentales de las personas con discapacidad.`;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <main className="home-container" lang="es">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      <A11yBar />

      {/* Hero */}
      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <h1 id="hero-title">Inclusión y <span className="highlight">Discapacidad</span></h1>
        <p>
          Según la <strong>OMS</strong>, más de <strong>1.300 millones de personas</strong> viven con algún tipo de discapacidad.  
          La inclusión digital es clave para garantizar sus derechos y oportunidades.
        </p>

        <div className="hero-buttons" role="navigation" aria-label="Navegación interna discapacidad">
          <button onClick={() => scrollTo(barriersRef)} aria-label="Conocer barreras comunes">Barreras</button>
          <button onClick={() => scrollTo(solutionsRef)} aria-label="Conocer soluciones accesibles">Soluciones</button>
          <button onClick={() => scrollTo(rightsRef)} aria-label="Ver derechos fundamentales">Derechos</button>
          <button className="talkback-btn" onClick={talkbackIntro}>🔊 Activar TalkBack</button>
        </div>
      </section>

      {/* Barreras */}
      <section ref={barriersRef} className="section" tabIndex={-1}>
        <h2>Barreras comunes</h2>
        <ul>
          <li><strong>Visuales</strong>: falta de contraste, ausencia de descripciones alternativas en imágenes, textos pequeños.</li>
          <li><strong>Auditivas</strong>: ausencia de subtítulos, transcripciones o interpretación en Lengua de Señas.</li>
          <li><strong>Motrices</strong>: sitios que no permiten navegación solo con teclado o dispositivos de asistencia.</li>
          <li><strong>Cognitivas</strong>: lenguaje complejo, estructuras confusas, sobrecarga de información.</li>
        </ul>
      </section>

      {/* Soluciones */}
      <section ref={solutionsRef} className="section alt" tabIndex={-1}>
        <h2>Soluciones accesibles</h2>
        <ul>
          <li>Implementar <strong>WAI-ARIA</strong> y buenas prácticas de accesibilidad web (WCAG 2.1).</li>
          <li>Agregar subtítulos, transcripciones y <strong>videos en Lengua de Señas</strong>.</li>
          <li>Permitir navegación por teclado y compatibilidad con lectores de pantalla.</li>
          <li>Ofrecer modos de alto contraste, aumento de texto y espaciado adaptable.</li>
          <li>Diseñar contenidos con <strong>lenguaje claro y sencillo</strong>.</li>
        </ul>
      </section>

      {/* Derechos */}
      <section ref={rightsRef} className="section" tabIndex={-1}>
        <h2>Derechos fundamentales</h2>
        <p>
          La <strong>Convención de la ONU sobre los Derechos de las Personas con Discapacidad </strong> 
          establece el acceso a la información, la educación y la participación plena como derechos humanos.  
          Knowledge asume este compromiso al garantizar accesibilidad total en sus servicios digitales.
        </p>
        <p>
          Accesibilidad no es un extra: es un <strong>derecho</strong> y una <strong>responsabilidad social</strong>.
        </p>
      </section>
    </main>
  );
}
