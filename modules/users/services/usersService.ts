import { getToken } from "../../auth/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface User {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  status?: "ACTIVE" | "INACTIVE";
}

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching users");
  }

  return response.json();
};

// Obtener un usuario por ID
export const getUserById = async (id: string): Promise<User> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching user");
  }

  return response.json();
};

// Crear un nuevo usuario
export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Error creating user");
  }

  return response.json();
};

// Actualizar un usuario
export const updateUser = async (
  id: string,
  userData: UpdateUserRequest
): Promise<User> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Error updating user");
  }

  return response.json();
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error deleting user");
  }
};

// Cambiar estado de usuario
export const toggleUserStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<User> => {
  return updateUser(id, { status });
};
