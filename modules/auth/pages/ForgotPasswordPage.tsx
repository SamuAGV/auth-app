import { useState } from "react";
import { requestPasswordReset } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      }, 2000);
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

      {/* Tarjeta de recuperación */}
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
        {/* Logo */}
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
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="#0ea5e9" />
                <path
                  d="M16 8V12M16 24V20M8 16H12M24 16H20"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
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
          <h1>Recuperar contraseña</h1>
          <h2>
            {isSubmitted 
              ? "Te hemos enviado un código de verificación" 
              : "Ingresa tu correo para recibir un código de recuperación"}
          </h2>
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

        {/* Contenido principal */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Campo de email */}
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    className="login-input"
                    placeholder="      nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              {/* Botón de envío */}
              <motion.button
                type="submit"
                className="login-button"
                disabled={isLoading}
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
                    Enviando código...
                  </span>
                ) : (
                  "Enviar código"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              className="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                padding: "1rem 0",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
              >
                <CheckCircle size={64} color="#4ade80" />
              </motion.div>
              
              <div style={{ textAlign: "center" }}>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ 
                    color: "#f8fafc", 
                    fontSize: "1.125rem",
                    margin: "0 0 0.5rem 0",
                    fontWeight: 500
                  }}
                >
                  ¡Correo enviado!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ 
                    color: "#94a3b8", 
                    fontSize: "0.875rem",
                    margin: 0
                  }}
                >
                  Revisa tu bandeja de entrada
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ 
                    color: "#0ea5e9", 
                    fontSize: "0.875rem",
                    margin: "1rem 0 0 0"
                  }}
                >
                  Redirigiendo...
                </motion.p>
              </div>

              {/* Barra de progreso animada */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                style={{
                  height: "4px",
                  background: "linear-gradient(90deg, #0ea5e9, #2563eb)",
                  borderRadius: "2px",
                  marginTop: "0.5rem"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
          <span>Tus datos están seguros con nosotros</span>
        </motion.div>
      </motion.div>
    </div>
  );
}