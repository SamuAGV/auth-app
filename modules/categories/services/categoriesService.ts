import { getToken } from "../../auth/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://0.0.0.0:8000/api/categorias";

export interface Category {
  id: number;
  nombre: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error fetching categories");
  return response.json();
};

export const createCategory = async (data: { nombre: string }): Promise<Category> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error creating category");
  return response.json();
};

export const updateCategory = async (id: number, data: { nombre: string }): Promise<Category> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error updating category");
  return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error deleting category");
};