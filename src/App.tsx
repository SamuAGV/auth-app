import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import MfaPage from "../modules/auth/pages/MfaPage";
import MfaSetupPage from "../modules/auth/pages/MfaSetupPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import CategoriesPage from "../modules/categories/pages/CategoriesPage";
import CoursesPage from "../modules/courses/pages/CoursesPage";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/mfa" element={<MfaPage />} />
      <Route path="/mfa/setup" element={<MfaSetupPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;