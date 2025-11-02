import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, EditIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { getCourses, getCourseStudentCount, initDb } from '../../services/db';
export function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState(getCourses());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    initDb();
    setCourses(getCourses());
  }, []);
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const list = courses.filter((c) =>
      c.nome.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q)
    );
    return list;
  }, [courses, searchTerm]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);
  // Reset página ao buscar
  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize]);
  return <div className="space-y-6">
    <section className="flex items-center justify-between" aria-labelledby="courses-heading">
        <div>
      <h1 id="courses-heading" className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-1">Gerenciar cursos disponíveis</p>
        </div>
        <Link to="/cursos/novo" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Novo Curso
        </Link>
    </section>
    <section className="bg-white rounded-lg shadow-sm border border-gray-200" aria-labelledby="courses-table-heading">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="search" placeholder="Buscar por nome ou código..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Buscar cursos" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
              <select
                id="pageSize"
                className="px-2 py-1 border border-gray-300 rounded-lg"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
      <table className="w-full" aria-describedby="courses-table-heading">
      <caption id="courses-table-heading" className="sr-only">Lista de cursos com código, nome, carga horária, total de alunos e status</caption>
      <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Curso
                </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carga Horária
                </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alunos
                </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.map(course => <tr key={course.id} className="hover:bg-gray-50">
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
                      {getCourseStudentCount(course.id)}
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
        <nav className="px-6 py-4 border-t border-gray-200 flex items-center justify-between" aria-label="Paginação">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{total === 0 ? 0 : startIndex + 1}</span> a{' '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{total}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página <span className="font-medium">{currentPage}</span> de{' '}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próximo
            </button>
          </div>
        </nav>
      </section>
    </div>;
}