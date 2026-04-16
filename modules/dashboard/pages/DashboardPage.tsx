import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, X } from "lucide-react";
import UserTable from "../../users/components/UserTable";
import UserForm from "../../users/components/UserForm";
import { logout, getCurrentUserInfo } from "../../auth/services/authService";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../../users/services/usersService";
import type { User } from "../../users/services/usersService";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [userInfo, usersList] = await Promise.all([
        getCurrentUserInfo(),
        getUsers(),
      ]);
      setCurrentUser(userInfo);
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showToast("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateUser = async (data: {
    email: string;
    name: string;
    password?: string;
  }) => {
    try {
      await createUser(data as any);
      showToast("Usuario creado exitosamente", "success");
      setShowForm(false);
      loadDashboardData();
    } catch (error) {
      console.error("Error creating user:", error);
      showToast("Error al crear el usuario", "error");
    }
  };

  const handleUpdateUser = async (data: {
    email: string;
    name: string;
    password?: string;
  }) => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, data);
      showToast("Usuario actualizado exitosamente", "success");
      setShowForm(false);
      setEditingUser(undefined);
      loadDashboardData();
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Error al actualizar el usuario", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      await deleteUser(userId);
      showToast("Usuario eliminado exitosamente", "success");
      loadDashboardData();
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Error al eliminar el usuario", "error");
    }
  };

  const handleToggleStatus = async (
    userId: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      await toggleUserStatus(userId, status);
      showToast(
        `Usuario ${status === "ACTIVE" ? "activado" : "desactivado"}`,
        "success"
      );
      loadDashboardData();
    } catch (error) {
      console.error("Error toggling user status:", error);
      showToast("Error al cambiar el estado del usuario", "error");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      showToast("Error al cerrar sesión", "error");
    }
  };

  const openCreateForm = () => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
      {/* Elementos de fondo */}
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
            <button
              className="btn-logout"
              onClick={handleLogout}
            >
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
            <h2>Gestión de Usuarios</h2>
            <button
              className="btn-add"
              onClick={openCreateForm}
              disabled={loading}
            >
              <Plus size={16} style={{ marginRight: "8px" }} />
              Crear Usuario
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
              loading={loading}
            />
          </motion.div>
        </section>
      </main>

      <AnimatePresence>
        {showForm && (
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setShowForm(false);
              setEditingUser(undefined);
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => setToast(null)}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}