import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { cursosAPI, alunosAPI, obterMatriculasDetalhadas, MatriculaDetalhada, Curso, Aluno, getPeriodoLabel, avaliacoesAPI, Avaliacao, atividadesAPI, AtividadeAvaliativa } from '../../services/api';

export function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  
  const [course, setCourse] = useState<Curso | null>(null);
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [atividades, setAtividades] = useState<AtividadeAvaliativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [cursoData, matriculasData, alunosData, avaliacoesData, atividadesData] = await Promise.all([
          cursosAPI.obter(courseId),
          obterMatriculasDetalhadas(),
          alunosAPI.listar(),
          avaliacoesAPI.listar(),
          atividadesAPI.listar(),
        ]);
        
        setCourse(cursoData);
        setAlunos(alunosData);
        setAvaliacoes(avaliacoesData);
        setAtividades(atividadesData);
        
        // Filtrar matrículas apenas deste curso
        const matriculasCurso = matriculasData.filter(m => m.curso === courseId);
        setMatriculas(matriculasCurso);
      } catch (err) {
        console.error('Erro ao carregar dados do curso:', err);
        setError('Erro ao carregar dados do curso.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [courseId]);

  const alunosUnicos = useMemo(() => {
    const alunoMap = new Map(alunos.map(a => [a.id, a]));
    const ids = new Set(matriculas.map(m => m.aluno));
    return Array.from(ids).map(id => alunoMap.get(id)).filter((a): a is Aluno => !!a);
  }, [matriculas, alunos]);

  // Função para obter a média de um aluno em um curso
  const obterMediaAluno = (alunoId: number, cursoId: number): number | null => {
    const matricula = matriculas.find(m => m.aluno === alunoId && m.curso === cursoId);
    if (!matricula) return null;
    
    const avaliacao = avaliacoes.find(a => a.matricula === matricula.id);
    return avaliacao?.media || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Carregando dados do curso...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">{error || 'Curso não encontrado'}</h1>
        <Link to="/cursos" className="text-blue-600 hover:underline">Voltar</Link>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="course-detail-heading">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="course-detail-heading" className="text-3xl font-bold text-gray-900">{course.descricao}</h1>
          <p className="text-gray-600">Código: {course.codigo_curso} • Nível: {course.nivel}</p>
        </div>
        <Link to="/cursos" className="text-blue-600 hover:underline">Voltar</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Alunos Matriculados</h2>
          <span className="text-sm text-gray-600">Total: {alunosUnicos.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunosUnicos.map((aluno) => {
                const matricula = matriculas.find(m => m.aluno === aluno.id);
                const media = obterMediaAluno(aluno.id, courseId);
                
                return (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link to={`/alunos/${aluno.id}`} className="text-blue-600 hover:underline">
                        {aluno.nome}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {matricula ? getPeriodoLabel(matricula.periodo) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {media !== null ? (
                        <span className={`font-bold ${media >= 7 ? 'text-green-600' : media >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {media.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link 
                        to={`/alunos/${aluno.id}/progresso/${courseId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {alunosUnicos.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>Nenhum aluno matriculado neste curso.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {alunosUnicos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Resumo de Matrículas</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-blue-600">{alunosUnicos.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Matrículas</p>
                <p className="text-2xl font-bold text-green-600">{matriculas.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Períodos</p>
                <p className="text-sm text-gray-900 mt-2">
                  {Array.from(new Set(matriculas.map(m => m.periodo)))
                    .map(p => getPeriodoLabel(p))
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
