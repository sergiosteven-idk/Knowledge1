import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CSS/signup_styles.css";
import logoImg from "../assets/IMG/logo.png";
import A11yBar from "../components/A11yBar";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [errores, setErrores] = useState({ correo: "", contrasena: "", general: "" });

  const validar = () => {
    let ok = true;
    const next = { correo: "", contrasena: "", general: "" };
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) { next.correo = "El correo no tiene un formato válido"; ok = false; }
    if (contrasena.length < 6 || !/[a-zA-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      next.contrasena = "Debe tener al menos 6 caracteres, con letras y números"; ok = false;
    }
    setErrores(next);
    return ok;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    setErrores({ correo: "", contrasena: "", general: "" });
    login(
      { correo, contrasena },
      {
        onSuccess: () => {
          const params = new URLSearchParams(location.search);
          navigate(params.get("next") || "/admin", { replace: true });
        },
        onError: (err) => {
          setErrores((prev) => ({
            ...prev,
            general: err?.response?.data?.message || "Credenciales incorrectas o servidor no disponible",
          }));
        },
      }
    );
  };

  return (
    <div className="auth-wrapper">
      <A11yBar />
      <div className="signup-container">
        <div className="signup-card">
          <div className="logo-section">
            <div className="logo-container"><img src={logoImg} alt="Logo Knowledge" className="logo" /></div>
          </div>
          <h2>Iniciar sesión</h2>
          <form className="signup-form" onSubmit={onSubmit} noValidate aria-label="Formulario de inicio de sesión">
            {(errores.general || error) && (
              <div className="general-error" role="alert" aria-live="assertive">
                {errores.general || error?.response?.data?.message || "Ocurrió un error"}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input type="email" id="correo" name="correo" className="form-input" autoComplete="email"
                     maxLength={50} value={correo} onChange={(e)=>setCorreo(e.target.value)} required
                     aria-invalid={!!errores.correo} aria-describedby="correo-error" />
              <span id="correo-error" className="error-message">{errores.correo}</span>
            </div>
            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <div className="password-container">
                <input type={verPass ? "text" : "password"} id="contrasena" name="contrasena"
                       className="form-input" autoComplete="current-password" minLength={6} maxLength={100}
                       value={contrasena} onChange={(e)=>setContrasena(e.target.value)} required
                       aria-invalid={!!errores.contrasena} aria-describedby="password-error" />
                <button type="button" className="toggle-password" onClick={()=>setVerPass(v=>!v)}
                        aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {verPass ? "🙈" : "👁️"}
                </button>
              </div>
              <span id="password-error" className="error-message">{errores.contrasena}</span>
            </div>
            <div className="login-section">
              <Link to="/signup" className="login-link">¿No tienes cuenta? Regístrate</Link>
            </div>
            <button type="submit" className="signup-btn" disabled={isPending} aria-busy={isPending}>
              {isPending ? "Validando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
