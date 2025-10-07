import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import A11yBar from "../components/A11yBar";
import { useRegister } from "../hooks/useAuth";

export default function Signup() {
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({ nombre:"", apellido:"", correo:"", contrasena:"", general:"" });
  const { mutate: register, isPending, error } = useRegister();
  const navigate = useNavigate();

  const validar = () => {
    let ok = true;
    const next = { nombre:"", apellido:"", correo:"", contrasena:"", general:"" };
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s'-]{2,50}$/.test(form.nombre)) { next.nombre = "Nombre inválido"; ok = false; }
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s'-]{2,50}$/.test(form.apellido)) { next.apellido = "Apellido inválido"; ok = false; }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.correo)) { next.correo = "Correo inválido"; ok = false; }
    if (form.contrasena.length < 6 || !/[a-zA-Z]/.test(form.contrasena) || !/[0-9]/.test(form.contrasena)) {
      next.contrasena = "Mínimo 6 caracteres con letras y números"; ok = false;
    }
    setErrores(next); return ok;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    setErrores(prev => ({ ...prev, general: "" }));

    register(form, {
      onSuccess: () => {
        setMensaje("✅ Registro exitoso, redirigiendo...");
        const params = new URLSearchParams(location.search);
        setTimeout(() => navigate(params.get("next") || "/admin", { replace:true }), 1000);
      },
      onError: (err) => {
        setErrores(prev => ({ ...prev, general: err?.response?.data?.message || "Error en el registro" }));
      }
    });
  };

  return (
    <div className="auth-wrapper">
      <A11yBar />
      <div className="signup-container">
        <div className="signup-card">
          <h2>Crear cuenta</h2>
          <form className="signup-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de registro">
            {(errores.general || error) && (
              <div className="general-error" role="alert" aria-live="assertive">
                {errores.general || error?.response?.data?.message || "Ocurrió un error"}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input id="nombre" className="form-input" value={form.nombre}
                     onChange={(e)=>setForm({...form, nombre:e.target.value})} required
                     aria-invalid={!!errores.nombre} aria-describedby="nombre-error" />
              <span id="nombre-error" className="error-message">{errores.nombre}</span>
            </div>

            <div className="form-group">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input id="apellido" className="form-input" value={form.apellido}
                     onChange={(e)=>setForm({...form, apellido:e.target.value})} required
                     aria-invalid={!!errores.apellido} aria-describedby="apellido-error" />
              <span id="apellido-error" className="error-message">{errores.apellido}</span>
            </div>

            <div className="form-group">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input type="email" id="correo" className="form-input" value={form.correo}
                     onChange={(e)=>setForm({...form, correo:e.target.value})} required
                     aria-invalid={!!errores.correo} aria-describedby="correo-error" />
              <span id="correo-error" className="error-message">{errores.correo}</span>
            </div>

            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input type="password" id="contrasena" className="form-input" value={form.contrasena}
                     onChange={(e)=>setForm({...form, contrasena:e.target.value})} required
                     aria-invalid={!!errores.contrasena} aria-describedby="password-error" />
              <span id="password-error" className="error-message">{errores.contrasena}</span>
            </div>

            <button className="signup-btn" type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {mensaje && <p className="signup-message" role="status" aria-live="polite">{mensaje}</p>}

          <div className="login-section">
            <Link to="/login" className="login-link">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
