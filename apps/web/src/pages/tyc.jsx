// src/pages/tyc.jsx
import React from "react";

/**
 * Página de Términos y Condiciones
 * - SEO optimizado con metadatos dinámicos
 * - Estructura semántica accesible
 * - Diseño responsivo y limpio
 */
export default function Terminos() {
  return (
    <main
      className="max-w-4xl mx-auto px-6 py-10 text-gray-800 leading-relaxed"
      role="main"
    >
      {/* SEO y accesibilidad */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-gray-600">
          Última actualización: <time dateTime="2025-11-03">3 de noviembre de 2025</time>
        </p>
      </header>

      <article className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">
            1. Aceptación de los Términos
          </h2>
          <p>
            Al acceder o utilizar la plataforma <strong>Knowledge</strong>, el
            usuario acepta cumplir con estos términos y condiciones, así como
            con todas las leyes y regulaciones aplicables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">
            2. Uso de la Plataforma
          </h2>
          <p>
            El contenido de <strong>Knowledge</strong> está destinado a fines
            educativos y no podrá ser utilizado con propósitos comerciales sin
            autorización previa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">
            3. Accesibilidad y Privacidad
          </h2>
          <p>
            La plataforma garantiza accesibilidad conforme a las directrices{" "}
            <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> nivel
            AA y protege la información personal según las leyes de protección
            de datos vigentes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">
            4. Contacto
          </h2>
          <p>
            Si tienes preguntas sobre estos términos, puedes escribirnos a{" "}
            <a
              href="mailto:contacto@knowledge.org"
              className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500"
            >
              contacto@knowledge.org
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
