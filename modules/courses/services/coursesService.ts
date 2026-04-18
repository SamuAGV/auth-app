import { getToken } from "../../auth/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://0.0.0.0:8000/api/cursos";

export interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  precio: number;
  fecha_creacion: string;
}

export interface Category {
  id: number;
  nombre: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/cursos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error fetching courses");
  return response.json();
};

export const getCourseById = async (id: number): Promise<Course> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error fetching course");
  return response.json();
};

export const createCourse = async (data: {
  nombre: string;
  descripcion: string;
  categoria_id: number;
  precio: number;
}): Promise<Course> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/cursos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error creating course");
  return response.json();
};

export const updateCourse = async (id: number, data: {
  nombre: string;
  descripcion: string;
  categoria_id: number;
  precio: number;
}): Promise<Course> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error updating course");
  return response.json();
};

export const deleteCourse = async (id: number): Promise<void> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error deleting course");
};