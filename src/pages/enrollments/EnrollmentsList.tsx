import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FilterIcon, Trash2Icon } from 'lucide-react';
import { obterMatriculasDetalhadas, matriculasAPI, MatriculaDetalhada, getPeriodoLabel } from '../../services/api';

export function EnrollmentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollments, setEnrollments] = useState<MatriculaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros (rascunho e aplicados)
  const [statusDraft, setStatusDraft] = useState<string>('');
  const [periodDraft, setPeriodDraft] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('');

  useEffect(() => {
    const carregarMatriculas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obterMatriculasDetalhadas();
        setEnrollments(data);
      } catch (err) {
        console.error('Erro ao carregar matrículas:', err);
        setError('Erro ao carregar matrículas. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };
    carregarMatriculas();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let list = enrollments.filter(
      (e) => (e.aluno_nome?.toLowerCase().includes(q) || e.curso_descricao?.toLowerCase().includes(q))
    );
    if (periodFilter) {
      list = list.filter((e) => e.periodo === periodFilter);
    }
    return list;
  }, [enrollments, searchTerm, periodFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, periodFilter, pageSize]);

  const applyFilters = () => {
    setPeriodFilter(periodDraft);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta matrícula?')) {
      return;
    }
    try {
      await matriculasAPI.deletar(id);
      setEnrollments(enrollments.filter(e => e.id !== id));
      alert('Matrícula excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir matrícula:', err);
      alert('Erro ao excluir matrícula.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Carregando matrículas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
              className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-4"
            >
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
                  <option value="M">Matutino</option>
                  <option value="V">Vespertino</option>
                  <option value="N">Noturno</option>
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
                  Período
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
                    {enrollment.aluno_nome || `Aluno ID ${enrollment.aluno}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.curso_descricao || `Curso ID ${enrollment.curso}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPeriodoLabel(enrollment.periodo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(enrollment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Excluir matrícula"
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