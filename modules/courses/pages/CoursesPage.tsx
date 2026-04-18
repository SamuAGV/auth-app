import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../services/coursesService";
import { getCategories } from "../../categories/services/categoriesService";
import type { Course, Category } from "../services/coursesService";
import Navbar from "../../common/components/Navbar";
import "../styles/CoursesPage.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria_id: 0,
    precio: 0,
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData] = await Promise.all([
        getCourses(),
        getCategories(),
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      showToast("Error al cargar datos", "error");
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
    if (!formData.categoria_id) {
      showToast("Selecciona una categoría", "error");
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
        showToast("Curso actualizado", "success");
      } else {
        await createCourse(formData);
        showToast("Curso creado", "success");
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ nombre: "", descripcion: "", categoria_id: 0, precio: 0 });
      loadData();
    } catch (error) {
      showToast("Error al guardar", "error");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      nombre: course.nombre,
      descripcion: course.descripcion || "",
      categoria_id: course.categoria_id,
      precio: course.precio,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este curso?")) return;
    try {
      await deleteCourse(id);
      showToast("Curso eliminado", "success");
      loadData();
    } catch (error) {
      showToast("Error al eliminar", "error");
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.nombre || "Sin categoría";
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
              Gestión de Cursos
            </motion.h1>
            <motion.button
              className="btn-add"
              onClick={() => {
                setEditingCourse(null);
                setFormData({ nombre: "", descripcion: "", categoria_id: 0, precio: 0 });
                setShowModal(true);
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Plus size={18} /> Nuevo Curso
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
            ) : courses.length === 0 ? (
              <p className="empty-text">No hay cursos registrados</p>
            ) : (
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.nombre}</td>
                      <td className="description-cell">{course.descripcion?.substring(0, 50)}...</td>
                      <td>{getCategoryName(course.categoria_id)}</td>
                      <td>${course.precio.toFixed(2)}</td>
                      <td className="actions-cell">
                        <button className="btn-edit" onClick={() => handleEdit(course)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(course.id)}>
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
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCourse ? "Editar Curso" : "Nuevo Curso"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre del curso"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción del curso"
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      value={formData.categoria_id}
                      onChange={(e) => setFormData({ ...formData, categoria_id: Number(e.target.value) })}
                      required
                    >
                      <option value={0}>Seleccionar categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editingCourse ? "Actualizar" : "Crear"}
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