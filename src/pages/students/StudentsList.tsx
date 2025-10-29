import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FilterIcon, EyeIcon, EditIcon, Trash2Icon, DownloadIcon } from 'lucide-react';
const mockStudents = [{
  id: 1,
  nome: 'Ana Silva',
  cpf: '123.456.789-01',
  dataNasc: '12/05/2000',
  celular: '(31) 98888-7777',
  foto: null
}, {
  id: 2,
  nome: 'Carlos Souza',
  cpf: '987.654.321-00',
  dataNasc: '23/08/1999',
  celular: '(31) 99999-8888',
  foto: null
}, {
  id: 3,
  nome: 'Maria Santos',
  cpf: '456.789.123-45',
  dataNasc: '15/03/2001',
  celular: '(31) 97777-6666',
  foto: null
}];
export function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600 mt-1">Gerenciar cadastro de alunos</p>
        </div>
        <Link to="/alunos/novo" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Novo Aluno
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="search" placeholder="Buscar por nome ou CPF..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Buscar alunos" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FilterIcon className="w-5 h-5" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
          </div>
          {showFilters && <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Todos os cursos</option>
                  <option value="mat101">Matemática Básica</option>
                  <option value="port101">Português</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Todos os períodos</option>
                  <option value="M">Matutino</option>
                  <option value="V">Vespertino</option>
                  <option value="N">Noturno</option>
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
                  Foto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nasc.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockStudents.map(student => <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {student.nome.charAt(0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.dataNasc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.celular}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link to={`/alunos/${student.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" aria-label="Visualizar aluno">
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link to={`/alunos/${student.id}/editar`} className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors" aria-label="Editar aluno">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Excluir aluno">
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
            <span className="font-medium">3</span> de{' '}
            <span className="font-medium">3</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>;
}