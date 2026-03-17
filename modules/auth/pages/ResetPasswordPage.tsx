import { useState, useEffect } from "react";
import { confirmPasswordReset, requestPasswordReset } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    // Obtener email del state si viene de ForgotPasswordPage
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    }
  }, [location.state]);

  const validatePassword = (): string | null => {
    if (newPassword.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(newPassword)) {
      return "La contraseña debe tener al menos una mayúscula.";
    }
    if (!/[a-z]/.test(newPassword)) {
      return "La contraseña debe tener al menos una minúscula.";
    }
    if (!/[0-9]/.test(newPassword)) {
      return "La contraseña debe tener al menos un número.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return "La contraseña debe tener al menos un carácter especial.";
    }
    if (newPassword !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(email, code, newPassword);
      setIsSuccess(true);
      showToast("Contraseña actualizada correctamente", "success");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";
      
      if (errorMessage.includes("CodeMismatchException")) {
        setError("El código de verificación es incorrecto.");
      } else if (errorMessage.includes("ExpiredCodeException")) {
        setError("El código ha expirado. Solicita uno nuevo.");
      } else if (errorMessage.includes("InvalidPasswordException")) {
        setError("La contraseña no cumple con los requisitos de seguridad.");
      } else if (errorMessage.includes("LimitExceededException")) {
        setError("Demasiados intentos. Por favor, espera un momento.");
      } else {
        setError("Error al restablecer la contraseña. Intenta de nuevo.");
      }
      showToast("Error al restablecer contraseña", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Ingresa tu correo electrónico primero.");
      return;
    }
    
    setIsResending(true);
    setError("");

    try {
      await requestPasswordReset(email);
      showToast("Nuevo código enviado", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al reenviar código", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="8" fill="white" />
              <path
                d="M10 16C10 12.6863 12.6863 10 16 10C18.4274 10 20.5051 11.4508 21.4315 13.5"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M22 16C22 19.3137 19.3137 22 16 22C13.5726 22 11.4949 20.5492 10.5685 18.5"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M21 10V14H17" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 22V18H15" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Nueva contraseña</h1>
          <h2>
            {isSuccess 
              ? "Tu contraseña ha sido actualizada" 
              : "Ingresa el código y tu nueva contraseña"}
          </h2>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M8 4.5V8.5M8 11V11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {!location.state?.email && (
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="code">Código de verificación</label>
                <button 
                  type="button" 
                  className="resend-link"
                  onClick={handleResendCode}
                  disabled={isResending}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    width: "auto",
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontWeight: 400,
                  }}
                >
                  {isResending ? "Enviando..." : "Reenviar código"}
                </button>
              </div>
              <input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoComplete="one-time-code"
                disabled={isLoading}
                maxLength={6}
                style={{ letterSpacing: "0.5em", textAlign: "center" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            <div className="password-requirements" style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              padding: "0.75rem",
              background: "var(--secondary)",
              borderRadius: "0.5rem",
              lineHeight: 1.6,
            }}>
              <p style={{ margin: 0, marginBottom: "0.5rem", fontWeight: 500 }}>La contraseña debe tener:</p>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                <li style={{ color: newPassword.length >= 8 ? "var(--accent)" : undefined }}>
                  Al menos 8 caracteres
                </li>
                <li style={{ color: /[A-Z]/.test(newPassword) ? "var(--accent)" : undefined }}>
                  Una letra mayúscula
                </li>
                <li style={{ color: /[a-z]/.test(newPassword) ? "var(--accent)" : undefined }}>
                  Una letra minúscula
                </li>
                <li style={{ color: /[0-9]/.test(newPassword) ? "var(--accent)" : undefined }}>
                  Un número
                </li>
                <li style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "var(--accent)" : undefined }}>
                  Un carácter especial
                </li>
              </ul>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="spinner"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="50"
                      strokeDashoffset="20"
                    />
                  </svg>
                  Actualizando...
                </span>
              ) : (
                "Restablecer contraseña"
              )}
            </button>
          </form>
        ) : (
          <div className="success-message" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem 0",
          }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="20" stroke="var(--accent)" strokeWidth="2" />
              <path
                d="M16 24L22 30L32 18"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p style={{ margin: 0, color: "var(--foreground)" }}>Contraseña actualizada</p>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        )}

        <div className="login-footer">
          <p>
            <a href="/">Volver al inicio de sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}
