import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FilterIcon, Trash2Icon } from 'lucide-react';
const mockEnrollments = [{
  id: 1,
  aluno: 'Ana Silva',
  curso: 'Matemática Básica',
  dataMatricula: '15/01/2024',
  status: 'Ativa'
}, {
  id: 2,
  aluno: 'Ana Silva',
  curso: 'Português',
  dataMatricula: '15/01/2024',
  status: 'Ativa'
}, {
  id: 3,
  aluno: 'Carlos Souza',
  curso: 'Inglês',
  dataMatricula: '20/01/2024',
  status: 'Ativa'
}, {
  id: 4,
  aluno: 'Maria Santos',
  curso: 'História',
  dataMatricula: '10/02/2024',
  status: 'Cancelada'
}];
export function EnrollmentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matrículas</h1>
          <p className="text-gray-600 mt-1">Gerenciar matrículas de alunos</p>
        </div>
        <Link to="/matriculas/nova" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Nova Matrícula
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="search" placeholder="Buscar por aluno ou curso..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Buscar matrículas" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FilterIcon className="w-5 h-5" />
              Filtros
            </button>
          </div>
          {showFilters && <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Todos</option>
                  <option value="ativa">Ativa</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Todos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Matrícula
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
              {mockEnrollments.map(enrollment => <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {enrollment.aluno}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.curso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.dataMatricula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${enrollment.status === 'Ativa' ? 'bg-green-100 text-green-800' : enrollment.status === 'Cancelada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Cancelar matrícula">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
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