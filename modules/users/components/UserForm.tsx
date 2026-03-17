import { useState } from "react";
import type { User } from "../services/usersService";
import "../styles/UserForm.css";

interface UserFormProps {
  user?: User;
  onSubmit: (data: {
    email: string;
    name: string;
    password?: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  loading = false,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.name) {
      newErrors.name = "El nombre es requerido";
    }

    if (!user) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData: {
        email: string;
        name: string;
        password?: string;
      } = {
        email: formData.email,
        name: formData.name,
      };

      if (!user) {
        submitData.password = formData.password;
      }

      await onSubmit(submitData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-modal">
        <div className="form-header">
          <h2>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>
          <button
            className="close-btn"
            onClick={onCancel}
            disabled={submitting || loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting || loading}
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting || loading}
              placeholder="Nombre completo"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {!user && (
            <>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={submitting || loading}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={submitting || loading}
                  placeholder="Confirmar contraseña"
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onCancel}
              disabled={submitting || loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || loading}
            >
              {submitting || loading
                ? "Guardando..."
                : user
                  ? "Actualizar"
                  : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
