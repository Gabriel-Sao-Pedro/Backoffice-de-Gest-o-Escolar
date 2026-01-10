import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { alunosAPI, cursosAPI, avaliacoesAPI, atividadesAPI, obterMatriculasDetalhadas, Aluno, Curso, Avaliacao, AtividadeAvaliativa, MatriculaDetalhada, getPeriodoLabel } from '../../services/api';

export function StudentProgress() {
  const { id, courseId } = useParams();
  const studentId = Number(id);
  const cId = Number(courseId);
  
  const [student, setStudent] = useState<Aluno | null>(null);
  const [course, setCourse] = useState<Curso | null>(null);
  const [matricula, setMatricula] = useState<MatriculaDetalhada | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [atividades, setAtividades] = useState<AtividadeAvaliativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const [alunoData, cursoData, matriculasData, avaliacoesData, atividadesData] = await Promise.all([
          alunosAPI.obter(studentId),
          cursosAPI.obter(cId),
          obterMatriculasDetalhadas(),
          avaliacoesAPI.listar(),
          atividadesAPI.listar(),
        ]);

        setStudent(alunoData);
        setCourse(cursoData);

        // Encontrar a matrícula específica
        const matriculaEncontrada = matriculasData.find(
          (m) => m.aluno === studentId && m.curso === cId
        );

        if (!matriculaEncontrada) {
          setError('Matrícula não encontrada para este aluno neste curso.');
          return;
        }

        setMatricula(matriculaEncontrada);

        // Encontrar avaliação e atividades da matrícula
        const avaliacaoEncontrada = avaliacoesData.find(
          (a) => a.matricula === matriculaEncontrada.id
        );
        setAvaliacao(avaliacaoEncontrada || null);

        const atividadesAluno = atividadesData.filter(
          (a) => a.matricula === matriculaEncontrada.id
        );
        setAtividades(atividadesAluno);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do progresso do aluno.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [studentId, cId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Carregando progresso do aluno...</p>
      </div>
    );
  }

  if (error || !student || !course) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">{error || 'Dados não encontrados'}</h1>
        <Link to={`/cursos/${cId}`} className="text-blue-600 hover:underline">
          Voltar para o curso
        </Link>
      </section>
    );
  }

  // Estatísticas
  const atividadesEntregues = atividades.filter((a) => a.entregue).length;
  const totalAtividades = atividades.length;
  const percentualEntrega = totalAtividades > 0 ? (atividadesEntregues / totalAtividades) * 100 : 0;
  const atividadesVencidas = atividades.filter(
    (a) => !a.entregue && !!a.data_entrega && new Date(a.data_entrega) < new Date()
  ).length;

  const atividadesPorTipo = {
    atividades: atividades.filter((a) => a.tipo === 'A'),
    provas: atividades.filter((a) => a.tipo === 'P'),
    trabalhos: atividades.filter((a) => a.tipo === 'T'),
  };

  return (
    <section className="space-y-6" aria-labelledby="student-progress-heading">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 id="student-progress-heading" className="text-3xl font-bold text-gray-900">
            Progresso de {student.nome}
          </h1>
          <p className="text-gray-600">Curso: {course.descricao}</p>
        </div>
        <Link to={`/cursos/${cId}`} className="text-blue-600 hover:underline">
          Voltar para o curso
        </Link>
      </div>

      {/* Informações do Aluno e Matrícula */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Informações da Matrícula</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Aluno</p>
              <p className="text-lg font-semibold">{student.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CPF</p>
              <p className="text-lg font-semibold">
                {student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Período</p>
              <p className="text-lg font-semibold">
                {matricula ? getPeriodoLabel(matricula.periodo) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Média Final</p>
              <p className={`text-2xl font-bold ${
                (avaliacao?.media ?? 0) >= 7 ? 'text-green-600' :
                (avaliacao?.media ?? 0) > 4 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {avaliacao?.media ? Number(avaliacao.media).toFixed(1) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Situação</p>
              <p className={`text-lg font-semibold ${
                avaliacao?.situacao === 'Aprovado' ? 'text-green-600' :
                avaliacao?.situacao === 'Prova Final' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {avaliacao?.situacao ?? '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total de Atividades</p>
          <p className="text-3xl font-bold text-blue-600">{totalAtividades}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Entregues</p>
          <p className="text-3xl font-bold text-green-600">{atividadesEntregues}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600">{totalAtividades - atividadesEntregues}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Vencidas</p>
          <p className="text-3xl font-bold text-red-600">{atividadesVencidas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">% Entrega</p>
          <p className="text-3xl font-bold text-purple-600">{percentualEntrega.toFixed(0)}%</p>
        </div>
      </div>

      {/* Notas Gerais */}
      {avaliacao && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Notas Gerais</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Nota 1</p>
                <p className="text-3xl font-bold text-blue-600">{Number(avaliacao.nota1).toFixed(1)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Nota 2</p>
                <p className="text-3xl font-bold text-blue-600">{Number(avaliacao.nota2).toFixed(1)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Nota 3</p>
                <p className="text-3xl font-bold text-blue-600">{Number(avaliacao.nota3).toFixed(1)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Média Final</p>
                <p className={`text-3xl font-bold ${
                  Number(avaliacao.media) >= 7 ? 'text-green-600' :
                  Number(avaliacao.media) > 4 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Number(avaliacao.media).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Atividades por Tipo */}
      {Object.entries(atividadesPorTipo).map(([tipo, items]) => {
        if (items.length === 0) return null;

        const tipoLabel = tipo === 'atividades' ? 'Atividades' : tipo === 'provas' ? 'Provas' : 'Trabalhos';
        const tipoColor = tipo === 'provas' ? 'red' : tipo === 'trabalhos' ? 'purple' : 'blue';

        return (
          <div key={tipo} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold">{tipoLabel} ({items.length})</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((atividade) => {
                  const isOverdue = !atividade.entregue && !!atividade.data_entrega && new Date(atividade.data_entrega) < new Date();
                  return (
                    <div key={atividade.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 text-sm rounded font-semibold bg-${tipoColor}-100 text-${tipoColor}-700`}>
                              {atividade.tipo_display}
                            </span>
                            {atividade.entregue ? (
                              <span className="px-3 py-1 text-sm rounded font-semibold bg-green-100 text-green-700">
                                ✓ Entregue
                              </span>
                            ) : isOverdue ? (
                              <span className="px-3 py-1 text-sm rounded font-semibold bg-red-100 text-red-700">
                                ✗ Não entregue
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-sm rounded font-semibold bg-yellow-100 text-yellow-700">
                                ⏳ Pendente
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{atividade.titulo}</h3>
                          {atividade.descricao && (
                            <p className="text-gray-600 mb-2">{atividade.descricao}</p>
                          )}
                          {atividade.data_entrega && (
                            <p className="text-sm text-gray-500">
                              📅 Data de entrega: {new Date(atividade.data_entrega).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-6">
                          {atividade.nota !== null ? (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Nota</p>
                              <p className={`text-4xl font-bold ${
                                Number(atividade.nota) >= 7 ? 'text-green-600' :
                                Number(atividade.nota) >= 5 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {Number(atividade.nota).toFixed(1)}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-sm text-gray-400">Aguardando</p>
                              <p className="text-2xl text-gray-300">-</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Mensagem se não houver atividades */}
      {totalAtividades === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhuma atividade cadastrada para este aluno neste curso.</p>
        </div>
      )}
    </section>
  );
}

