import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoriesService";
import type { Category } from "../services/categoriesService";
import Navbar from "../../common/components/Navbar";
import "../styles/CategoriesPage.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      showToast("Error al cargar categorías", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      showToast("El nombre es requerido", "error");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showToast("Categoría actualizada", "success");
      } else {
        await createCategory(formData);
        showToast("Categoría creada", "success");
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ nombre: "" });
      loadCategories();
    } catch (error) {
      showToast("Error al guardar", "error");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ nombre: category.nombre });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      showToast("Categoría eliminada", "success");
      loadCategories();
    } catch (error) {
      showToast("Error al eliminar", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="crud-container">
        <div className="grid-background" />
        <div className="tech-circle tech-circle-1" />
        <div className="tech-circle tech-circle-2" />

        <div className="crud-content">
          <div className="crud-header">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Gestión de Categorías
            </motion.h1>
            <motion.button
              className="btn-add"
              onClick={() => {
                setEditingCategory(null);
                setFormData({ nombre: "" });
                setShowModal(true);
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Plus size={18} /> Nueva Categoría
            </motion.button>
          </div>

          <motion.div
            className="crud-table-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <p className="loading-text">Cargando...</p>
            ) : categories.length === 0 ? (
              <p className="empty-text">No hay categorías registradas</p>
            ) : (
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.nombre}</td>
                      <td className="actions-cell">
                        <button className="btn-edit" onClick={() => handleEdit(category)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                          <Trash2 size={16} />
                        </button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ nombre: e.target.value })}
                    placeholder="Ej: Programación, Diseño, Marketing..."
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editingCategory ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </div>
    </>
  );
}