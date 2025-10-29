import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, EyeIcon, EditIcon, Trash2Icon, UsersIcon } from 'lucide-react';
const mockCourses = [{
  id: 1,
  codigo: 'MAT101',
  nome: 'Matemática Básica',
  cargaHoraria: 60,
  totalAlunos: 45,
  status: 'Ativo'
}, {
  id: 2,
  codigo: 'PORT101',
  nome: 'Português',
  cargaHoraria: 40,
  totalAlunos: 38,
  status: 'Ativo'
}, {
  id: 3,
  codigo: 'ING101',
  nome: 'Inglês',
  cargaHoraria: 80,
  totalAlunos: 52,
  status: 'Ativo'
}, {
  id: 4,
  codigo: 'HIST101',
  nome: 'História',
  cargaHoraria: 40,
  totalAlunos: 35,
  status: 'Inativo'
}];
export function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-1">Gerenciar cursos disponíveis</p>
        </div>
        <Link to="/cursos/novo" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Novo Curso
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="search" placeholder="Buscar por nome ou código..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Buscar cursos" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carga Horária
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alunos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCourses.map(course => <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.cargaHoraria}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      {course.totalAlunos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link to={`/cursos/${course.id}/editar`} className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors" aria-label="Editar curso">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Excluir curso">
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">1</span> a{' '}
            <span className="font-medium">4</span> de{' '}
            <span className="font-medium">4</span> resultados
          </p>
        </div>
      </div>
    </div>;
}