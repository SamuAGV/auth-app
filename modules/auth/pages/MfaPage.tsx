import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmMfa } from "../services/authService";
import { useToast } from "../components/Toast";
import { Shield, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginPage.css";

export default function MfaPage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      await confirmMfa(code);
      showToast("Autenticado correctamente", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Código incorrecto";
      
      if (errorMessage.includes("expired")) {
        setError("El código ha expirado. Por favor, genera uno nuevo.");
        showToast("Código expirado", "warning");
      } else {
        setError("Código incorrecto. Verifica e intenta de nuevo.");
        showToast("Error de verificación", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Elementos de fondo */}
      <motion.div 
        className="grid-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div 
        className="tech-circle tech-circle-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      <motion.div 
        className="tech-circle tech-circle-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Botón de retroceso */}
      <motion.button
        className="back-button"
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Volver al inicio"
      >
        <ArrowLeft size={20} />
      </motion.button>

      {/* Tarjeta MFA */}
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      >
        {/* Logo con icono de Shield */}
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="logo-wrapper">
            <div className="logo-glow"></div>
            <motion.div 
              className="logo-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield size={60} color="#0ea5e9" />
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="login-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1>Verificación MFA</h1>
          <h2>Ingresa el código de 6 dígitos de tu app de autenticación</h2>
        </motion.div>

        {/* Mensaje de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario */}
        <form onSubmit={handleConfirm} className="login-form">
          {/* Campo de código */}
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="input-wrapper">
              <Shield className="input-icon" size={18} />
              <input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="login-input"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                disabled={isLoading}
                style={{ 
                  letterSpacing: "0.5em", 
                  textAlign: "center", 
                  fontSize: "1.5rem",
                  fontFamily: "'SF Mono', 'Roboto Mono', monospace",
                  fontWeight: 600
                }}
              />
            </div>
            <p className="input-hint" style={{
              margin: "0.5rem 0 0 0",
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center"
            }}>
              Abre tu app de autenticación para ver el código
            </p>
          </motion.div>

          {/* Botón de verificación */}
          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading || code.length !== 6}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
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
              "Verificar"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>
            <a href="/">Volver al inicio de sesión</a>
          </p>
        </motion.div>

        {/* Nota de seguridad */}
        <motion.div
          className="security-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          <span>Autenticación de dos factores activa</span>
        </motion.div>
      </motion.div>
    </div>
  );
}