import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, FilterIcon, EyeIcon, EditIcon, Trash2Icon, DownloadIcon } from 'lucide-react';
import { alunosAPI, cursosAPI, matriculasAPI, Aluno, Curso } from '../../services/api';

export function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Aluno[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // Filtros
  const [courseDraft, setCourseDraft] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('');
  
  const formatarCPF = (cpf: string): string => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarCelular = (celular: string): string => {
    if (!celular || celular.trim() === '') return '-';
    return celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        const [alunosData, cursosData] = await Promise.all([
          alunosAPI.listar('v2'),
          cursosAPI.listar(),
        ]);
        setStudents(alunosData);
        setCourses(cursosData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let list = students.filter((s) =>
      s.nome.toLowerCase().includes(q) || s.cpf.toLowerCase().includes(q)
    );
    // Filtro por curso será implementado quando tivermos os dados de matrícula
    // Por enquanto, apenas filtragem simples por nome e CPF
    return list;
  }, [students, searchTerm]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);
  useEffect(() => {
    setPage(1);
  }, [searchTerm, courseFilter, pageSize]);
  const applyFilters = () => {
    setCourseFilter(courseDraft);
  };
  const [showFilters, setShowFilters] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno? As matrículas associadas também serão removidas.')) {
      return;
    }
    try {
      await alunosAPI.deletar(id);
      setStudents(students.filter(s => s.id !== id));
      alert('Aluno e suas matrículas foram excluídos com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir aluno:', err);
      alert('Erro ao excluir aluno.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Carregando alunos...</p>
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

  return <div className="space-y-6">
      <section className="flex items-center justify-between" aria-labelledby="students-heading">
        <div>
          <h1 id="students-heading" className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600 mt-1">Gerenciar cadastro de alunos</p>
        </div>
        <Link to="/alunos/novo" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Novo Aluno
        </Link>
      </section>
      <section className="bg-white rounded-lg shadow-sm border border-gray-200" aria-labelledby="students-table-heading">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="search" placeholder="Buscar por nome ou CPF..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Buscar alunos" />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeStudents" className="text-sm text-gray-600">Itens por página</label>
              <select
                id="pageSizeStudents"
                className="px-2 py-1 border border-gray-300 rounded-lg"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-expanded={showFilters} aria-controls="students-filters">
              <FilterIcon className="w-5 h-5" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
          </div>
          {showFilters && <div id="students-filters" className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={courseDraft}
                  onChange={(e) => setCourseDraft(e.target.value)}
                >
                  <option value="">Todos os cursos</option>
                  {courses.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.descricao}
                    </option>
                  ))}
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
                <button type="button" onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-describedby="students-table-heading">
            <caption id="students-table-heading" className="sr-only">Lista de alunos com foto, ID, nome, CPF, data de nascimento e celular</caption>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nasc.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.map(student => <tr key={student.id} className="hover:bg-gray-50">
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
                    {formatarCPF(student.cpf)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(student.data_nascimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatarCelular(student.celular)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link to={`/alunos/${student.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" aria-label="Visualizar aluno">
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link to={`/alunos/${student.id}/editar`} className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors" aria-label="Editar aluno">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                        aria-label="Excluir aluno"
                      >
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