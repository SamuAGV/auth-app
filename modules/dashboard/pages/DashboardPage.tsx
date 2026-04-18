import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, FolderOpen, BookOpen } from "lucide-react";
import { logout, getCurrentUserInfo } from "../../auth/services/authService";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfo = await getCurrentUserInfo();
      setCurrentUser(userInfo);
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    {
      title: "Gestión de Cursos",
      description: "Administrar cursos, precios y descripciones",
      icon: <BookOpen size={48} />,
      path: "/courses",
      color: "#0ea5e9",
    },
    {
      title: "Gestión de Categorías",
      description: "Administrar categorías de cursos",
      icon: <FolderOpen size={48} />,
      path: "/categories",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="grid-background" />
      <div className="tech-circle tech-circle-1" />
      <div className="tech-circle tech-circle-2" />

      <header className="dashboard-header">
        <div className="header-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Panel de Administración
          </motion.h1>
          <motion.div
            className="header-info"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {currentUser && (
              <span className="user-email">{currentUser.email}</span>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={16} style={{ marginRight: "8px" }} />
              Cerrar Sesión
            </button>
          </motion.div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Módulos del Sistema</h2>
            <p className="section-description">
              Selecciona un módulo para comenzar a gestionar
            </p>
          </motion.div>

          <div className="menu-grid">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                className="menu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(item.path)}
              >
                <div className="menu-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="menu-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}