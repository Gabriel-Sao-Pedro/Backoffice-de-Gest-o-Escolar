import React, { useState } from 'react';
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
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        {isAuthenticated ? <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="alunos" element={<StudentsList />} />
            <Route path="alunos/novo" element={<StudentForm />} />
            <Route path="alunos/:id" element={<StudentDetail />} />
            <Route path="alunos/:id/editar" element={<StudentForm />} />
            <Route path="cursos" element={<CoursesList />} />
            <Route path="cursos/novo" element={<CourseForm />} />
            <Route path="cursos/:id/editar" element={<CourseForm />} />
            <Route path="matriculas" element={<EnrollmentsList />} />
            <Route path="matriculas/nova" element={<EnrollmentForm />} />
            <Route path="importar-exportar" element={<ImportExport />} />
            <Route path="relatorios" element={<Reports />} />
          </Route> : <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </BrowserRouter>;
}