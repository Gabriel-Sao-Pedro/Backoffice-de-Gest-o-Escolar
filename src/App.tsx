// App de rotas com AuthProvider
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentsList } from './pages/students/StudentsList';
import { StudentForm } from './pages/students/StudentForm';
import { StudentDetail } from './pages/students/StudentDetail';
import { CoursesList } from './pages/courses/CoursesList';
import { CourseForm } from './pages/courses/CourseForm';
import { EnrollmentsList } from './pages/enrollments/EnrollmentsList';
import { EnrollmentForm } from './pages/enrollments/EnrollmentForm';
import { ImportExport } from './pages/ImportExport';
import { Reports } from './pages/Reports';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { seedDefaultUsers } from './services/auth';
import { useEffect } from 'react';
import { CourseDetail } from './pages/courses/CourseDetail';
import { Signup } from './pages/Signup';
import { StudentProgress } from './pages/students/StudentProgress';
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    seedDefaultUsers();
  }, []);
  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/cadastro" element={<Signup />} />
      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="alunos" element={<StudentsList />} />
          <Route path="alunos/novo" element={<StudentForm />} />
          <Route path="alunos/:id" element={<StudentDetail />} />
          <Route path="alunos/:id/progresso/:courseId" element={<StudentProgress />} />
          <Route path="alunos/:id/editar" element={<StudentForm />} />
          <Route path="cursos" element={<CoursesList />} />
          <Route path="cursos/novo" element={<CourseForm />} />
          <Route path="cursos/:id" element={<CourseDetail />} />
          <Route path="cursos/:id/editar" element={<CourseForm />} />
          <Route path="matriculas" element={<EnrollmentsList />} />
          <Route path="matriculas/nova" element={<EnrollmentForm />} />
          {/** Turmas removidas da UI; funcionalidades movidas para Cursos */}
          <Route path="importar-exportar" element={<ImportExport />} />
          <Route path="relatorios" element={<Reports />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}