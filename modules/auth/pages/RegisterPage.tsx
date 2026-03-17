import { useState } from "react";
import { register, confirmRegistration, resendConfirmationCode } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import "./LoginPage.css";

type Step = "register" | "confirm";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validatePassword = (): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe tener al menos una mayúscula.";
    }
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe tener al menos una minúscula.";
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe tener al menos un número.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "La contraseña debe tener al menos un carácter especial.";
    }
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(email, password, name);
      
      if (response.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        setStep("confirm");
        showToast("Código de verificación enviado", "success");
      } else if (response.nextStep?.signUpStep === "DONE") {
        showToast("Cuenta creada correctamente", "success");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";
      
      if (errorMessage.includes("UsernameExistsException")) {
        setError("Ya existe una cuenta con este correo electrónico.");
      } else if (errorMessage.includes("InvalidPasswordException")) {
        setError("La contraseña no cumple con los requisitos de seguridad.");
      } else if (errorMessage.includes("InvalidParameterException")) {
        setError("Formato de correo electrónico inválido.");
      } else {
        setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
      }
      showToast("Error al registrar", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmRegistration(email, confirmationCode);
      showToast("Cuenta verificada correctamente", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";
      
      if (errorMessage.includes("CodeMismatchException")) {
        setError("El código de verificación es incorrecto.");
      } else if (errorMessage.includes("ExpiredCodeException")) {
        setError("El código ha expirado. Solicita uno nuevo.");
      } else if (errorMessage.includes("NotAuthorizedException")) {
        setError("La cuenta ya ha sido verificada.");
      } else {
        setError("Error al verificar la cuenta. Intenta de nuevo.");
      }
      showToast("Error al verificar", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      await resendConfirmationCode(email);
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
              <circle cx="16" cy="12" r="4" stroke="#0a0a0a" strokeWidth="2.5" />
              <path
                d="M10 24C10 20.6863 12.6863 18 16 18C19.3137 18 22 20.6863 22 24"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1>{step === "register" ? "Crear cuenta" : "Verificar cuenta"}</h1>
          <h2>
            {step === "register"
              ? "Completa el formulario para registrarte"
              : "Ingresa el código enviado a tu correo"}
          </h2>
        </div>

        {step === "register" ? (
          <form onSubmit={handleRegister} className="login-form">
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
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                disabled={isLoading}
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Repite tu contraseña"
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
                <li style={{ color: password.length >= 8 ? "var(--accent)" : undefined }}>
                  Al menos 8 caracteres
                </li>
                <li style={{ color: /[A-Z]/.test(password) ? "var(--accent)" : undefined }}>
                  Una letra mayúscula
                </li>
                <li style={{ color: /[a-z]/.test(password) ? "var(--accent)" : undefined }}>
                  Una letra minúscula
                </li>
                <li style={{ color: /[0-9]/.test(password) ? "var(--accent)" : undefined }}>
                  Un número
                </li>
                <li style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? "var(--accent)" : undefined }}>
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
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmation} className="login-form">
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

            <div className="confirmation-info" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              background: "var(--secondary)",
              borderRadius: "0.5rem",
              marginBottom: "0.5rem",
            }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0, color: "var(--accent)" }}
              >
                <path
                  d="M2 5L10 10L18 5M2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V5M2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground)" }}>
                  Código enviado a:
                </p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  {email}
                </p>
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="code">Código de verificación</label>
                <button 
                  type="button" 
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
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoComplete="one-time-code"
                disabled={isLoading}
                maxLength={6}
                style={{ letterSpacing: "0.5em", textAlign: "center" }}
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
                  Verificando...
                </span>
              ) : (
                "Verificar cuenta"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("register")}
              style={{
                background: "var(--secondary)",
                color: "var(--foreground)",
              }}
            >
              Volver al registro
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <a href="/">Iniciar sesión</a>
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
          <span>Tu información está protegida con encriptación</span>
        </div>
      </div>
    </div>
  );
}
