// src/components/A11yBar.jsx
import React, { useEffect, useState } from "react";
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
  const synth = typeof window !== "undefined" && window.speechSynthesis;

  useEffect(() => {
    document.documentElement.dataset.a11yFont = settings.fontSize;
    document.documentElement.dataset.a11yContrast = settings.contrast;
    document.documentElement.dataset.a11ySpacing = settings.spacing;
    document.documentElement.dataset.a11ySimplified = settings.simplified ? "1" : "0";
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
  }, [settings]);

  // TalkBack helpers
  const speakText = (text) => {
    if (!synth) return;
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = settings.talkBackRate || 1;
    // idioma detectado (fallback a español)
    utter.lang = navigator.language?.startsWith("es") ? "es-ES" : "es-ES";
    synth.speak(utter);
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
  };

  const stopSpeaking = () => {
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "t") {
        // Alt+T toggles talkback: reads title/hero
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
  }, [settings]);

  return (
    <div className={`a11y-bar ${open ? "open" : ""}`} aria-hidden={false}>
      <button
        className="a11y-toggle"
        aria-expanded={open}
        aria-controls="a11y-controls"
        onClick={() => setOpen(v => !v)}
        title="Ajustes de accesibilidad"
      >
        ♿ Accesibilidad
      </button>

      <div id="a11y-controls" className="a11y-controls" role="region" aria-label="Controles de accesibilidad">
        <div className="a11y-row">
          <label>Fuente</label>
          <div className="a11y-group">
            {["small","normal","large","xlarge"].map(s => (
              <button
                key={s}
                className={settings.fontSize===s ? "active" : ""}
                onClick={() => setSettings(prev => ({ ...prev, fontSize: s }))}
                aria-pressed={settings.fontSize===s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="a11y-row">
          <label>Contraste</label>
          <div className="a11y-group">
            <button onClick={() => setSettings(prev => ({ ...prev, contrast: "normal" }))}
              className={settings.contrast==="normal" ? "active":""}>Normal</button>
            <button onClick={() => setSettings(prev => ({ ...prev, contrast: "high" }))}
              className={settings.contrast==="high" ? "active":""}>Alto</button>
          </div>
        </div>

        <div className="a11y-row">
          <label>Espaciado</label>
          <div className="a11y-group">
            <button onClick={() => setSettings(prev => ({ ...prev, spacing: "normal" }))}
              className={settings.spacing==="normal" ? "active":""}>Normal</button>
            <button onClick={() => setSettings(prev => ({ ...prev, spacing: "wide" }))}
              className={settings.spacing==="wide" ? "active":""}>Amplio</button>
          </div>
        </div>

        <div className="a11y-row">
          <label>Modo lectura</label>
          <div className="a11y-group">
            <button onClick={() => setSettings(prev => ({ ...prev, simplified: !prev.simplified }))}
              aria-pressed={settings.simplified}>
              {settings.simplified ? "Activado" : "Activar"}
            </button>
          </div>
        </div>

        <div className="a11y-row">
          <label>TalkBack</label>
          <div className="a11y-group talkback-controls">
            <button onClick={() => speakText(document.querySelector(".hero")?.innerText || "Bienvenido a Knowledge")}>Leer Hero</button>
            <button onClick={() => speakText(document.querySelector(".section")?.innerText || "Sección")}>Leer Sección</button>
            <button onClick={stopSpeaking} disabled={!speaking}>Parar</button>
            <label aria-hidden="true">Vel</label>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.1"
              value={settings.talkBackRate || 1}
              onChange={(e) => setSettings(prev => ({ ...prev, talkBackRate: Number(e.target.value) }))}
              aria-label="Velocidad de lectura"
            />
          </div>
        </div>

        <div className="a11y-row">
          <button onClick={() => {
            // reset
            setSettings(defaultSettings);
            localStorage.removeItem("a11y-settings");
          }}>Restablecer</button>
        </div>
      </div>
    </div>
  );
}
