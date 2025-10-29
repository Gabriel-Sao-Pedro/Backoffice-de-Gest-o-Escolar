import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, EditIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, BookOpenIcon } from 'lucide-react';
const mockStudent = {
  id: 1,
  nome: 'Ana Silva',
  cpf: '123.456.789-01',
  dataNascimento: '12/05/2000',
  idade: 24,
  celular: '(31) 98888-7777',
  email: 'ana.silva@email.com',
  endereco: {
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30000-000'
  },
  matriculas: [{
    id: 1,
    curso: 'Matemática Básica',
    dataMatricula: '15/01/2024',
    status: 'Ativa'
  }, {
    id: 2,
    curso: 'Português',
    dataMatricula: '15/01/2024',
    status: 'Ativa'
  }, {
    id: 3,
    curso: 'História',
    dataMatricula: '10/02/2023',
    status: 'Concluída'
  }]
};
export function StudentDetail() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  return <div className="space-y-6">
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
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {mockStudent.nome.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {mockStudent.nome}
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {mockStudent.id} | CPF: {mockStudent.cpf}
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nascimento</p>
                  <p className="text-sm font-medium text-gray-900">
                    {mockStudent.dataNascimento}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mockStudent.idade} anos
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
                    {mockStudent.celular}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MailIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {mockStudent.email}
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
                    {mockStudent.matriculas.length} cursos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Endereço */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPinIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Endereço</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Logradouro</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.logradouro}, {mockStudent.endereco.numero}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Complemento</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.complemento || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bairro</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.bairro}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cidade</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.cidade}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.estado}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CEP</p>
            <p className="text-sm font-medium text-gray-900">
              {mockStudent.endereco.cep}
            </p>
          </div>
        </div>
      </div>
      {/* Matrículas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Histórico de Matrículas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockStudent.matriculas.map(matricula => <tr key={matricula.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {matricula.curso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {matricula.dataMatricula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${matricula.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {matricula.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}