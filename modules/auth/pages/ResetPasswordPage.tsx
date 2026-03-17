import { useState, useEffect } from "react";
import { confirmPasswordReset, requestPasswordReset } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Mail, Lock, Shield, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginPage.css";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const passwordRequirements = [
    { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
    { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Una letra minúscula", test: (p: string) => /[a-z]/.test(p) },
    { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
    { label: "Un carácter especial", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const validatePassword = (): string | null => {
    if (newPassword !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    
    const failedRequirement = passwordRequirements.find(req => !req.test(newPassword));
    if (failedRequirement) {
      return `La contraseña debe tener: ${failedRequirement.label.toLowerCase()}`;
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
      showToast("Nuevo código enviado a tu correo", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al reenviar código", "error");
    } finally {
      setIsResending(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

      {/* Tarjeta de restablecimiento */}
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
                  d="M10 16C10 12.6863 12.6863 10 16 10C18.4274 10 20.5051 11.4508 21.4315 13.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M22 16C22 19.3137 19.3137 22 16 22C13.5726 22 11.4949 20.5492 10.5685 18.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M21 10V14H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 22V18H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          <h1>Nueva contraseña</h1>
          <h2>
            {isSuccess 
              ? "Tu contraseña ha sido actualizada" 
              : "Ingresa el código y tu nueva contraseña"}
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
          {!isSuccess ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Campo de email (si no viene del state) */}
              {!location.state?.email && (
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
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              )}

              {/* Campo de código de verificación */}
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="label-row">
                  <label htmlFor="code">Código de verificación</label>
                  <button 
                    type="button" 
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="forgot-link"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {isResending ? "Enviando..." : "Reenviar código"}
                  </button>
                </div>
                <div className="input-wrapper">
                  <Shield className="input-icon" size={18} />
                  <input
                    id="code"
                    type="text"
                    className="login-input"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    autoComplete="one-time-code"
                    disabled={isLoading}
                    maxLength={6}
                    style={{ letterSpacing: "0.5em", textAlign: "center", fontSize: "1.2rem" }}
                  />
                </div>
              </motion.div>

              {/* Campo de nueva contraseña CON ver contraseña */}
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="password-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="password-input"
                    placeholder="     Crea una contraseña segura"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Campo de confirmar contraseña CON ver contraseña */}
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="password-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="password-input"
                    placeholder="     Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={toggleShowConfirmPassword}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Requisitos de contraseña */}
              <motion.div 
                className="password-requirements"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "8px",
                  padding: "1rem",
                  border: "1px solid rgba(14, 165, 233, 0.1)",
                }}
              >
                <p style={{ 
                  margin: "0 0 0.75rem 0", 
                  color: "#f8fafc", 
                  fontSize: "0.875rem",
                  fontWeight: 500 
                }}>
                  Requisitos de seguridad:
                </p>
                <ul style={{ 
                  margin: 0, 
                  padding: 0, 
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}>
                  {passwordRequirements.map((req, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.75rem",
                        color: req.test(newPassword) ? "#4ade80" : "#94a3b8",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {req.test(newPassword) ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {req.label}
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.75rem",
                      color: newPassword && confirmPassword && newPassword === confirmPassword ? "#4ade80" : "#94a3b8",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {newPassword && confirmPassword && newPassword === confirmPassword ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Las contraseñas coinciden
                  </motion.li>
                </ul>
              </motion.div>

              {/* Botón de envío */}
              <motion.button
                type="submit"
                className="login-button"
                disabled={isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
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
                    Actualizando...
                  </span>
                ) : (
                  "Restablecer contraseña"
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
                  ¡Contraseña actualizada!
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
                  Redirigiendo al inicio de sesión...
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
          transition={{ duration: 0.5, delay: 1.2 }}
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
          transition={{ duration: 0.5, delay: 1.3 }}
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