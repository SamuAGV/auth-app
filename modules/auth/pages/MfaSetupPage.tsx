import { useState } from "react";
import { confirmSignIn } from "aws-amplify/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "../components/Toast";
import AuthCard from "../components/AuthCard";
import "./MfaPage.css";

export default function MfaSetupPage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const setupUri = location.state?.setupUri;

  const validateCode = (value: string): boolean => {
    return /^\d{6}$/.test(value);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (error) setError("");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCode(code)) {
      setError("El código debe tener exactamente 6 dígitos numéricos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await confirmSignIn({
        challengeResponse: code,
      });
      showToast("MFA configurado correctamente", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error confirmando TOTP:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al configurar MFA";
      
      if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
        setError("El código es inválido o ha expirado. Genera uno nuevo.");
        showToast("Código inválido", "error");
      } else {
        setError("Error al configurar MFA. Por favor, intenta de nuevo.");
        showToast("Error de configuración", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const QRIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
      />
    </svg>
  );

  return (
    <AuthCard
      icon={QRIcon}
      title="Configura tu MFA"
      subtitle="Escanea este código QR con Google Authenticator u otra app de autenticación"
    >
      {setupUri && (
        <div className="qr-container" role="img" aria-label="Código QR para configurar MFA">
          <QRCodeSVG value={setupUri} size={180} />
        </div>
      )}

      <form onSubmit={handleConfirm} className="mfa-form">
        {error && (
          <div className="error-message" role="alert">
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
          <label htmlFor="setup-code" className="sr-only">
            Código de verificación
          </label>
          <input
            id="setup-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mfa-input"
            placeholder="000000"
            value={code}
            onChange={handleCodeChange}
            maxLength={6}
            aria-label="Código de verificación de 6 dígitos"
            aria-describedby={error ? "setup-error" : undefined}
            aria-invalid={!!error}
            disabled={isLoading}
          />
          <p className="input-hint">
            Ingresa el código de 6 dígitos que muestra tu app
          </p>
        </div>

        <button
          type="submit"
          className="mfa-button"
          disabled={isLoading || code.length !== 6}
        >
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
              Configurando...
            </span>
          ) : (
            "Confirmar MFA"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
