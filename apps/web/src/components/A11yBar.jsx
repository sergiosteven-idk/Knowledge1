// src/components/A11yBar.jsx
import React, { useCallback, useEffect, useState } from "react";
import "../assets/CSS/styles.css";
import "../assets/CSS/home.css";

/**
 * Barra de accesibilidad:
 * - tamaño de fuente: small/normal/large/xlarge
 * - contraste: normal/alto
 * - espaciado: normal/amplio
 * - modo lectura simplificada
 * - talkback: play/pause/stop, velocidad
 * Persistencia: localStorage
 */

const defaultSettings = {
  fontSize: "normal", // small | normal | large | xlarge
  contrast: "normal", // normal | high
  spacing: "normal", // normal | wide
  simplified: false,
  talkBackVoice: "default",
  talkBackRate: 1,
};

const PDF_JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.js";
const PDF_JS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js";
let pdfLoaderPromise;

function ensurePdfJs() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PDF.js no está disponible en SSR"));
  }
  if (window.pdfjsLib) {
    if (window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER_URL;
    }
    return Promise.resolve(window.pdfjsLib);
  }
  if (!pdfLoaderPromise) {
    pdfLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PDF_JS_URL;
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib?.GlobalWorkerOptions) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER_URL;
        }
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error("No se pudo cargar PDF.js"));
      document.head.appendChild(script);
    });
  }
  return pdfLoaderPromise;
}

export default function A11yBar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("a11y-settings")) || defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [speaking, setSpeaking] = useState(false);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    document.documentElement.dataset.a11yFont = settings.fontSize;
    document.documentElement.dataset.a11yContrast = settings.contrast;
    document.documentElement.dataset.a11ySpacing = settings.spacing;
    document.documentElement.dataset.a11ySimplified = settings.simplified ? "1" : "0";
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
  }, [settings]);

  const speakText = useCallback((text, { append = false } = {}) => {
    if (!synth || !text) return;
    if (!append) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = settings.talkBackRate || 1;
    utter.lang = navigator.language?.startsWith("es") ? "es-ES" : "es-ES";
    synth.speak(utter);
    setSpeaking(true);
    utter.onend = () => {
      if (!synth.speaking && !synth.pending) {
        setSpeaking(false);
      }
    };
  }, [settings.talkBackRate, synth]);

  const speakChunks = useCallback((text) => {
    if (!text) return;
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText) return;
    const maxChunk = 400;
    for (let i = 0; i < cleanText.length; i += maxChunk) {
      const chunk = cleanText.slice(i, i + maxChunk);
      speakText(chunk, { append: i !== 0 });
    }
  }, [speakText]);

  const stopSpeaking = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  }, [synth]);

  useEffect(() => {
    if (!synth) return;
    const timeout = setTimeout(() => {
      const pageTitle = document.title || window.location.pathname || "esta página";
      speakText(`Estás en la página ${pageTitle}`);
    }, 400);
    return () => clearTimeout(timeout);
  }, [speakText, synth]);

  useEffect(() => {
    if (!synth) return;
    const handleSelection = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
        speakText(selection);
      }
    };
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [speakText, synth]);

  useEffect(() => {
    if (!synth) return;
    const handleFileChange = async (event) => {
      const file = event.target?.files?.[0];
      if (!file || file.type !== "application/pdf") return;
      try {
        const pdfjsLib = await ensurePdfJs();
        if (!pdfjsLib) throw new Error("PDF.js no disponible");
        const data = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        speakText(`Leyendo el archivo ${file.name} con ${pdf.numPages} páginas.`);
        let combinedText = "";
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => (typeof item.str === "string" ? item.str : ""))
            .join(" ");
          combinedText += ` Página ${pageNumber}: ${pageText}\n`;
        }
        speakChunks(combinedText);
      } catch (error) {
        console.error("Error al leer PDF", error);
        speakText(`No fue posible leer el archivo ${file.name}.`);
      }
    };

    document.addEventListener("change", handleFileChange, true);
    return () => {
      document.removeEventListener("change", handleFileChange, true);
    };
  }, [speakChunks, speakText, synth]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        const heroText = document.querySelector(".hero")?.innerText;
        speakText(heroText || "Bienvenido a Knowledge");
      }
      if ((e.altKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        document.querySelector(".hero")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [speakText]);

  return (
    <div className={`a11y-bar ${open ? "open" : ""}`} aria-hidden={false}>
      <button
        className="a11y-toggle"
        aria-expanded={open}
        aria-controls="a11y-controls"
        onClick={() => setOpen((v) => !v)}
        title="Ajustes de accesibilidad"
      >
        ♿ Accesibilidad
      </button>

      <div id="a11y-controls" className="a11y-controls" role="region" aria-label="Controles de accesibilidad">
        <div className="a11y-row">
          <label>Fuente</label>
          <div className="a11y-group">
            {["small", "normal", "large", "xlarge"].map((s) => (
              <button
                key={s}
                className={settings.fontSize === s ? "active" : ""}
                onClick={() => setSettings((prev) => ({ ...prev, fontSize: s }))}
                aria-pressed={settings.fontSize === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="a11y-row">
          <label>Contraste</label>
          <div className="a11y-group">
            <button
              onClick={() => setSettings((prev) => ({ ...prev, contrast: "normal" }))}
              className={settings.contrast === "normal" ? "active" : ""}
            >
              Normal
            </button>
            <button
              onClick={() => setSettings((prev) => ({ ...prev, contrast: "high" }))}
              className={settings.contrast === "high" ? "active" : ""}
            >
              Alto
            </button>
          </div>
        </div>

        <div className="a11y-row">
          <label>Espaciado</label>
          <div className="a11y-group">
            <button
              onClick={() => setSettings((prev) => ({ ...prev, spacing: "normal" }))}
              className={settings.spacing === "normal" ? "active" : ""}
            >
              Normal
            </button>
            <button
              onClick={() => setSettings((prev) => ({ ...prev, spacing: "wide" }))}
              className={settings.spacing === "wide" ? "active" : ""}
            >
              Amplio
            </button>
          </div>
        </div>

        <div className="a11y-row">
          <label>Modo lectura</label>
          <div className="a11y-group">
            <button
              onClick={() => setSettings((prev) => ({ ...prev, simplified: !prev.simplified }))}
              aria-pressed={settings.simplified}
            >
              {settings.simplified ? "Activado" : "Activar"}
            </button>
          </div>
        </div>

        <div className="a11y-row">
          <label>TalkBack</label>
          <div className="a11y-group talkback-controls">
            <button onClick={() => speakText(document.querySelector(".hero")?.innerText || "Bienvenido a Knowledge")}>
              Leer Hero
            </button>
            <button onClick={() => speakText(document.querySelector(".section")?.innerText || "Sección")}>Leer Sección</button>
            <button onClick={stopSpeaking} disabled={!speaking}>Parar</button>
            <label aria-hidden="true">Vel</label>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.1"
              value={settings.talkBackRate || 1}
              onChange={(e) => setSettings((prev) => ({ ...prev, talkBackRate: Number(e.target.value) }))}
              aria-label="Velocidad de lectura"
            />
          </div>
        </div>

        <div className="a11y-row">
          <button
            onClick={() => {
              setSettings(defaultSettings);
              localStorage.removeItem("a11y-settings");
            }}
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
}
