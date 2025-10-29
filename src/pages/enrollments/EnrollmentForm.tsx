import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
const mockStudents = [{
  id: 1,
  nome: 'Ana Silva'
}, {
  id: 2,
  nome: 'Carlos Souza'
}, {
  id: 3,
  nome: 'Maria Santos'
}];
const mockCourses = [{
  id: 1,
  nome: 'Matemática Básica'
}, {
  id: 2,
  nome: 'Português'
}, {
  id: 3,
  nome: 'Inglês'
}];
export function EnrollmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alunoId: '',
    cursoId: '',
    dataMatricula: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.alunoId) {
      newErrors.alunoId = 'Selecione um aluno';
    }
    if (!formData.cursoId) {
      newErrors.cursoId = 'Selecione um curso';
    }
    if (!formData.dataMatricula) {
      newErrors.dataMatricula = 'Data de matrícula é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Criando matrícula:', formData);
      navigate('/matriculas');
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Matrícula</h1>
          <p className="text-gray-600 mt-1">Matricule um aluno em um curso</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="alunoId" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Aluno *
            </label>
            <select id="alunoId" name="alunoId" value={formData.alunoId} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.alunoId ? 'border-red-500' : 'border-gray-300'}`} aria-required="true" aria-invalid={!!errors.alunoId}>
              <option value="">Selecione um aluno</option>
              {mockStudents.map(student => <option key={student.id} value={student.id}>
                  {student.nome}
                </option>)}
            </select>
            {errors.alunoId && <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.alunoId}
              </p>}
          </div>
          <div>
            <label htmlFor="cursoId" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Curso *
            </label>
            <select id="cursoId" name="cursoId" value={formData.cursoId} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.cursoId ? 'border-red-500' : 'border-gray-300'}`} aria-required="true" aria-invalid={!!errors.cursoId}>
              <option value="">Selecione um curso</option>
              {mockCourses.map(course => <option key={course.id} value={course.id}>
                  {course.nome}
                </option>)}
            </select>
            {errors.cursoId && <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.cursoId}
              </p>}
          </div>
          <div>
            <label htmlFor="dataMatricula" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Matrícula *
            </label>
            <input id="dataMatricula" name="dataMatricula" type="date" value={formData.dataMatricula} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.dataMatricula ? 'border-red-500' : 'border-gray-300'}`} aria-required="true" aria-invalid={!!errors.dataMatricula} />
            {errors.dataMatricula && <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.dataMatricula}
              </p>}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
          <button type="button" onClick={() => navigate('/matriculas')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <XIcon className="w-4 h-4" />
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <SaveIcon className="w-4 h-4" />
            Criar Matrícula
          </button>
        </div>
      </form>
    </div>;
}