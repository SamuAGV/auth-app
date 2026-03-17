import type { User } from "../services/usersService";
import "../styles/UserTable.css";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, status: "ACTIVE" | "INACTIVE") => void;
  loading?: boolean;
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  loading = false,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="user-table-container">
        <p className="loading-text">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-table-container">
        <p className="empty-text">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={`row-${user.status.toLowerCase()}`}>
              <td className="email-cell">{user.email}</td>
              <td>{user.name}</td>
              <td>
                <span className={`status-badge status-${user.status.toLowerCase()}`}>
                  {user.status === "ACTIVE" ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
              <td className="actions-cell">
                <button
                  className="btn btn-sm btn-edit"
                  onClick={() => onEdit(user)}
                  title="Editar usuario"
                >
                  ✏️
                </button>
                <button
                  className={`btn btn-sm btn-toggle ${
                    user.status === "ACTIVE" ? "btn-deactivate" : "btn-activate"
                  }`}
                  onClick={() =>
                    onToggleStatus(
                      user.id,
                      user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                    )
                  }
                  title={
                    user.status === "ACTIVE"
                      ? "Desactivar usuario"
                      : "Activar usuario"
                  }
                >
                  {user.status === "ACTIVE" ? "🚫" : "✅"}
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => onDelete(user.id)}
                  title="Eliminar usuario"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
