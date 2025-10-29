import React, { useState } from 'react';
import { UsersIcon, BookOpenIcon, GraduationCapIcon, TrendingUpIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
const chartData = [{
  curso: 'Matemática Básica',
  alunos: 45
}, {
  curso: 'Português',
  alunos: 38
}, {
  curso: 'Inglês',
  alunos: 52
}, {
  curso: 'Ciências',
  alunos: 41
}, {
  curso: 'História',
  alunos: 35
}];
export function Dashboard() {
  const [period, setPeriod] = useState('30');
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumo operacional do sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Selecionar período">
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Atualizar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total de Alunos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUpIcon className="w-4 h-4" />
                +12% vs mês anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total de Cursos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
              <p className="text-sm text-gray-500 mt-2">5 cursos ativos</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Matrículas Ativas
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">892</p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUpIcon className="w-4 h-4" />
                +8% este mês
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCapIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Alunos por Curso
        </h2>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>;
}