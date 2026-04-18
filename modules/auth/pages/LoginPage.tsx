import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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

      {/* Tarjeta de login */}
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
                  d="M8 16L14 22L24 10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
          <h1>Bienvenido</h1>
          <h2>Ingresa tus credenciales para acceder</h2>
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
        <form onSubmit={handleLogin} className="login-form">
          {/* Campo de email - CORREGIDO */}
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
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

          {/* Campo de contraseña - CORREGIDO */}
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="/forgot-password" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="password-input"
                placeholder="      Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          {/* Botón de inicio de sesión */}
          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </motion.button>

          {/* Footer */}
          <motion.div
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <p>
              ¿No tienes una cuenta?{" "}
              <a href="/register">Crear cuenta</a>
            </p>
          </motion.div>

          {/* Nota de seguridad */}
          <motion.div
            className="security-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
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
            <span>Protegido con autenticación segura MFA</span>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}