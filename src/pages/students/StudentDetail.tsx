import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, EditIcon, PhoneIcon, CalendarIcon, BookOpenIcon, UserIcon } from 'lucide-react';
import { alunosAPI, Aluno, obterMatriculasDetalhadas, MatriculaDetalhada, getPeriodoLabel } from '../../services/api';

export function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<Aluno | null>(null);
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [alunoData, todasMatriculas] = await Promise.all([
          alunosAPI.obter(Number(id)),
          obterMatriculasDetalhadas()
        ]);
        
        setStudent(alunoData);
        console.log('Dados do aluno carregados:', alunoData);
        console.log('Celular:', alunoData.celular, 'Tipo:', typeof alunoData.celular);
        
        // Filtrar matrículas do aluno
        const matriculasAluno = todasMatriculas.filter(m => m.aluno === Number(id));
        setMatriculas(matriculasAluno);
      } catch (err) {
        console.error('Erro ao carregar dados do aluno:', err);
        setError('Erro ao carregar dados do aluno.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [id]);

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatarData = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const formatarCPF = (cpf: string): string => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarRG = (rg: string): string => {
    if (!rg) return '-';
    // Formato: XX.XXX.XXX-X (9 dígitos)
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };

  const formatarCelular = (celular: string): string => {
    if (!celular || celular.trim() === '') return '-';
    return celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Carregando dados do aluno...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error || 'Aluno não encontrado'}</p>
          <button 
            onClick={() => navigate('/alunos')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/alunos')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar para lista
        </button>
        <Link to={`/alunos/${id}/editar`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <EditIcon className="w-4 h-4" />
          Editar Aluno
        </Link>
      </div>
      
      {/* Informações Principais */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {student.foto ? (
            <img 
              src={student.foto} 
              alt={student.nome}
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {student.nome.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {student.nome}
            </h1>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nascimento</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatarData(student.data_nascimento)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {calcularIdade(student.data_nascimento)} anos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Celular</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatarCelular(student.celular)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">CPF</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatarCPF(student.cpf)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Matrículas</p>
                  <p className="text-sm font-medium text-gray-900">
                    {matriculas.length} curso{matriculas.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matrículas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Matrículas Ativas
          </h2>
        </div>
        {matriculas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matriculas.map(matricula => <tr key={matricula.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {matricula.curso_descricao || `Curso ID ${matricula.curso}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPeriodoLabel(matricula.periodo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativa
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            Nenhuma matrícula encontrada para este aluno.
          </div>
        )}
      </div>
    </div>
  );
}