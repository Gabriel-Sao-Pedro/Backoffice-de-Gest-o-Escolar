import { useEffect, useState } from 'react';
import { UsersIcon, BookOpenIcon, GraduationCapIcon, TrendingUpIcon, TrendingDownIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { alunosAPI, cursosAPI, matriculasAPI, obterMatriculasDetalhadas } from '../services/api';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  activeEnrollments: number;
  studentsGrowth: number;
  coursesUtilization: number;
  enrollmentsGrowth: number;
}

export function Dashboard() {
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    studentsGrowth: 0,
    coursesUtilization: 0,
    enrollmentsGrowth: 0
  });
  const [chartData, setChartData] = useState<{ curso: string; alunos: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da API
      const [alunos, cursos, matriculas] = await Promise.all([
        alunosAPI.listar(),
        cursosAPI.listar(),
        obterMatriculasDetalhadas()
      ]);

      // Calcular estatísticas
      const totalAlunos = alunos.length;
      const totalCursos = cursos.length;
      const totalMatriculas = matriculas.length;

      // Calcular métricas
      // 1. Taxa de crescimento de alunos (baseado na média de matrículas por aluno)
      const alunosComMatricula = new Set(matriculas.map(m => m.aluno)).size;
      const taxaCrescimentoAlunos = totalAlunos > 0 
        ? Math.round(((alunosComMatricula / totalAlunos) * 100) - 100)
        : 0;

      // 2. Utilização de cursos (% de cursos com alunos matriculados)
      const cursosComAlunos = new Set(matriculas.map(m => m.curso)).size;
      const utilizacaoCursos = totalCursos > 0 
        ? Math.round((cursosComAlunos / totalCursos) * 100)
        : 0;

      // 3. Taxa de crescimento de matrículas (baseado na média por aluno)
      const mediaCursosAluno = alunosComMatricula > 0 
        ? totalMatriculas / alunosComMatricula 
        : 0;
      const taxaCrescimentoMatriculas = Math.round((mediaCursosAluno - 1) * 100);

      setStats({
        totalStudents: totalAlunos,
        totalCourses: totalCursos,
        activeEnrollments: totalMatriculas,
        studentsGrowth: taxaCrescimentoAlunos,
        coursesUtilization: utilizacaoCursos,
        enrollmentsGrowth: taxaCrescimentoMatriculas
      });

      // Calcular alunos por curso para o gráfico
      const alunosPorCurso: { [key: string]: number } = {};
      
      matriculas.forEach((matricula) => {
        const cursoNome = matricula.curso_descricao || 'Sem curso';
        alunosPorCurso[cursoNome] = (alunosPorCurso[cursoNome] || 0) + 1;
      });

      // Converter para formato do gráfico
      const dadosGrafico = Object.entries(alunosPorCurso).map(([curso, alunos]) => ({
        curso,
        alunos
      }));

      setChartData(dadosGrafico);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-6">
      <section aria-labelledby="dashboard-heading" className="flex items-center justify-between">
        <div>
          <h1 id="dashboard-heading" className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumo operacional do sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="period-select" className="sr-only">Selecionar período</label>
          <select id="period-select" value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Selecionar período">
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button 
            type="button" 
            onClick={carregarDados}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Carregando dados...</div>
        </div>
      ) : (
        <>
          <section aria-labelledby="cards-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <h2 id="cards-heading" className="sr-only">Indicadores principais</h2>
            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total de Alunos
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    stats.studentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.studentsGrowth >= 0 ? (
                      <TrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4" />
                    )}
                    {Math.abs(stats.studentsGrowth)}% de engajamento
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </article>
            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total de Cursos
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    {stats.coursesUtilization}% de utilização
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </article>
            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Matrículas Ativas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeEnrollments}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    stats.enrollmentsGrowth >= 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stats.enrollmentsGrowth >= 0 ? (
                      <>
                        <TrendingUpIcon className="w-4 h-4" />
                        {stats.enrollmentsGrowth}% acima da média
                      </>
                    ) : (
                      'Média de {Math.abs(stats.enrollmentsGrowth)}% por aluno'
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCapIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </article>
          </section>

          <section aria-labelledby="chart-heading" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 id="chart-heading" className="text-xl font-bold text-gray-900 mb-6">
              Alunos por Curso
            </h2>
            {chartData.length > 0 ? (
              <figure>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="curso" tick={{
                    fill: '#6b7280'
                  }} />
                    <YAxis tick={{
                    fill: '#6b7280'
                  }} />
                    <Tooltip contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} />
                    <Bar dataKey="alunos" fill="#0B5FFF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <figcaption className="sr-only">Gráfico de barras mostrando quantidade de alunos por curso</figcaption>
              </figure>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Nenhum dado disponível para exibir
              </div>
            )}
          </section>
        </>
      )}
      <section aria-labelledby="quick-actions" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <h2 id="quick-actions" className="sr-only">Ações rápidas</h2>
        <Link to="/relatorios" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DownloadIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">
                Gerar relatórios personalizados
              </p>
            </div>
          </div>
        </Link>
        <Link to="/importar-exportar" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UploadIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Importar CSV</h3>
              <p className="text-sm text-gray-600">Importar dados em lote</p>
            </div>
          </div>
        </Link>
      </section>
    </div>;
}