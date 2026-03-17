import { useState } from "react";
import { register, confirmRegistration, resendConfirmationCode } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Mail, Lock, User, ArrowLeft, Shield, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginPage.css";

type Step = "register" | "confirm";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const passwordRequirements = [
    { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
    { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Una letra minúscula", test: (p: string) => /[a-z]/.test(p) },
    { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
    { label: "Un carácter especial", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const validatePassword = (): string | null => {
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    
    const failedRequirement = passwordRequirements.find(req => !req.test(password));
    if (failedRequirement) {
      return `La contraseña debe tener: ${failedRequirement.label.toLowerCase()}`;
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
        showToast("Código de verificación enviado a tu correo", "success");
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

      {/* Tarjeta de registro */}
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
                <circle cx="16" cy="12" r="4" stroke="white" strokeWidth="2.5" />
                <path
                  d="M10 24C10 20.6863 12.6863 18 16 18C19.3137 18 22 20.6863 22 24"
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
          <h1>{step === "register" ? "Crear cuenta" : "Verificar cuenta"}</h1>
          <h2>
            {step === "register"
              ? "Completa el formulario para registrarte"
              : "Ingresa el código enviado a tu correo"}
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

        {/* Formulario */}
        {step === "register" ? (
          <form onSubmit={handleRegister} className="login-form">
            {/* Campo de nombre */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="name">Nombre completo</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="name"
                  type="text"
                  className="login-input"
                  placeholder="      Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Campo de email */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
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

            {/* Campo de contraseña CON ver contraseña */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="password">Contraseña</label>
              <div className="password-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="password-input"
                  placeholder="      Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="      Repite tu contraseña"
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
                      color: req.test(password) ? "#4ade80" : "#94a3b8",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {req.test(password) ? (
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
                    color: password && confirmPassword && password === confirmPassword ? "#4ade80" : "#94a3b8",
                    transition: "color 0.3s ease",
                  }}
                >
                  {password && confirmPassword && password === confirmPassword ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  Las contraseñas coinciden
                </motion.li>
              </ul>
            </motion.div>

            {/* Botón de registro */}
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
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleConfirmation} className="login-form">
            {/* Información de confirmación */}
            <motion.div 
              className="confirmation-info"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem",
                background: "rgba(14, 165, 233, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(14, 165, 233, 0.2)",
              }}
            >
              <Mail size={20} style={{ color: "#0ea5e9", flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#f8fafc" }}>
                  Código enviado a:
                </p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                  {email}
                </p>
              </div>
            </motion.div>

            {/* Campo de código de verificación */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoComplete="one-time-code"
                  disabled={isLoading}
                  maxLength={6}
                  style={{ letterSpacing: "0.5em", textAlign: "center", fontSize: "1.2rem" }}
                />
              </div>
            </motion.div>

            {/* Botón de verificación */}
            <motion.button
              type="submit"
              className="login-button"
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
                "Verificar cuenta"
              )}
            </motion.button>

            {/* Botón para volver al registro */}
            <motion.button
              type="button"
              onClick={() => setStep("register")}
              className="register-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(14, 165, 233, 0.3)",
                color: "#38bdf8",
                padding: "0.9rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginTop: "0.5rem",
              }}
            >
              Volver al registro
            </motion.button>
          </form>
        )}

        {/* Footer */}
        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p>
            ¿Ya tienes una cuenta?{" "}
            <a href="/">Iniciar sesión</a>
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
          <span>Tu información está protegida con encriptación</span>
        </motion.div>
      </motion.div>
    </div>
  );
}