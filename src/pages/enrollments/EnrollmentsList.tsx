import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FilterIcon, Trash2Icon } from 'lucide-react';
import { getEnrollmentsJoined, initDb } from '../../services/db';

export function EnrollmentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollments, setEnrollments] = useState(getEnrollmentsJoined());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros (rascunho e aplicados)
  const [statusDraft, setStatusDraft] = useState<string>('');
  const [periodDraft, setPeriodDraft] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('');

  useEffect(() => {
    initDb();
    setEnrollments(getEnrollmentsJoined());
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let list = enrollments.filter(
      (e) => e.aluno.toLowerCase().includes(q) || e.curso.toLowerCase().includes(q)
    );
    if (statusFilter) {
      const normalized = statusFilter.toLowerCase();
      list = list.filter((e) => e.status.toLowerCase() === normalized);
    }
    if (periodFilter) {
      // Considera apenas o ano no filtro de período
      list = list.filter(
        (e) => new Date(e.dataMatricula).getFullYear().toString() === periodFilter
      );
    }
    return list;
  }, [enrollments, searchTerm, statusFilter, periodFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, periodFilter, pageSize]);

  const applyFilters = () => {
    setStatusFilter(statusDraft);
    setPeriodFilter(periodDraft);
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between" aria-labelledby="enrollments-heading">
        <div>
          <h1 id="enrollments-heading" className="text-3xl font-bold text-gray-900">
            Matrículas
          </h1>
          <p className="text-gray-600 mt-1">Gerenciar matrículas de alunos</p>
        </div>
        <Link
          to="/matriculas/nova"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Matrícula
        </Link>
      </section>

      <section
        className="bg-white rounded-lg shadow-sm border border-gray-200"
        aria-labelledby="enrollments-table-heading"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar por aluno ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                aria-label="Buscar matrículas"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeEnrollments" className="text-sm text-gray-600">
                Itens por página
              </label>
              <select
                id="pageSizeEnrollments"
                className="px-2 py-1 border border-gray-300 rounded-lg"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-expanded={showFilters}
              aria-controls="enrollments-filters"
            >
              <FilterIcon className="w-5 h-5" />
              Filtros
            </button>
          </div>
          {showFilters && (
            <div
              id="enrollments-filters"
              className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={periodDraft}
                  onChange={(e) => setPeriodDraft(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={applyFilters}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" aria-describedby="enrollments-table-heading">
            <caption id="enrollments-table-heading" className="sr-only">
              Lista de matrículas com aluno, curso, data de matrícula e status
            </caption>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aluno
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Curso
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Matrícula
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
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
                    {new Date(enrollment.dataMatricula).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'Ativa'
                          ? 'bg-green-100 text-green-800'
                          : enrollment.status === 'Cancelada'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Cancelar matrícula"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav
          className="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
          aria-label="Paginação"
        >
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
    </div>
  );
}