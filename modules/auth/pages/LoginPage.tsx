import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);
      console.log("Login response:", response);

      if (response.nextStep?.signInStep === "CONTINUE_SIGN_IN_WITH_TOTP_SETUP") {
        const setupUri = response.nextStep.totpSetupDetails
          .getSetupUri("AuthApp", email)
          .toString();

        navigate("/mfa/setup", {
          state: { setupUri },
        });

        return;
      }

      if (response.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
        navigate("/mfa");
        return;
      }

      navigate("/dashboard");
      showToast("Sesión iniciada correctamente", "success");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";
      
      if (errorMessage.includes("NotAuthorizedException")) {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else if (errorMessage.includes("UserNotFoundException")) {
        setError("No existe una cuenta con este correo electrónico.");
      } else if (errorMessage.includes("UserNotConfirmedException")) {
        setError("Tu cuenta no ha sido verificada. Revisa tu correo.");
      } else {
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
      showToast("Error al iniciar sesión", "error");
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
                d="M8 16L14 22L24 10"
                stroke="#0a0a0a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Bienvenido de vuelta</h1>
          <h2>Ingresa tus credenciales para acceder a tu cuenta</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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
              aria-describedby={error ? "login-error" : undefined}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="/forgot-password" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-describedby={error ? "login-error" : undefined}
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
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/register">Crear cuenta</a>
          </p>
        </div>

        <div className="security-note">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 1L2 3.5V6.5C2 9.85 4.14 12.935 7 13.75C9.86 12.935 12 9.85 12 6.5V3.5L7 1Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 7L6.5 8.5L9 5.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Protegido con autenticación segura MFA</span>
        </div>
      </div>
    </div>
  );
}
