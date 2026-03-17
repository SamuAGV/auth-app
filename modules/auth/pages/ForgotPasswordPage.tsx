import { useState } from "react";
import { requestPasswordReset } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
      showToast("Código enviado a tu correo", "success");
      
      // Navegar a la página de reset con el email
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";
      
      if (errorMessage.includes("UserNotFoundException")) {
        setError("No existe una cuenta con este correo electrónico.");
      } else if (errorMessage.includes("LimitExceededException")) {
        setError("Demasiados intentos. Por favor, espera un momento.");
      } else {
        setError("Error al enviar el código. Por favor, intenta de nuevo.");
      }
      showToast("Error al enviar código", "error");
    } finally {
      setIsLoading(false);
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
                d="M16 8V12M16 24V20M8 16H12M24 16H20"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1>Recuperar contraseña</h1>
          <h2>
            {isSubmitted 
              ? "Te hemos enviado un código de verificación" 
              : "Ingresa tu correo para recibir un código de recuperación"}
          </h2>
        </div>

        {!isSubmitted ? (
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
                  Enviando código...
                </span>
              ) : (
                "Enviar código"
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
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
            <p>Revisa tu bandeja de entrada</p>
            <p className="muted">Redirigiendo...</p>
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
