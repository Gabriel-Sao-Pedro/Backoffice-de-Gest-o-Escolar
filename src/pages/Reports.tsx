import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, CalendarIcon } from 'lucide-react';
export function Reports() {
  const [reportType, setReportType] = useState('alunos');
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fim: ''
  });
  const handleGenerateReport = () => {
    console.log('Gerando relatório:', {
      reportType,
      dateRange
    });
    // Aqui você implementaria a lógica de geração de relatório
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-1">
          Gere relatórios personalizados do sistema
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Configurar Relatório
        </h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select id="reportType" value={reportType} onChange={e => setReportType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="alunos">Relatório de Alunos</option>
              <option value="cursos">Relatório de Cursos</option>
              <option value="matriculas">Relatório de Matrículas</option>
              <option value="frequencia">Relatório de Frequência</option>
              <option value="desempenho">Relatório de Desempenho</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input id="dataInicio" type="date" value={dateRange.inicio} onChange={e => setDateRange(prev => ({
              ...prev,
              inicio: e.target.value
            }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input id="dataFim" type="date" value={dateRange.fim} onChange={e => setDateRange(prev => ({
              ...prev,
              fim: e.target.value
            }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <button onClick={handleGenerateReport} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            Gerar Relatório
          </button>
        </div>
      </div>
      {/* Relatórios Rápidos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Relatórios Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <FileTextIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Alunos Ativos</h3>
            <p className="text-sm text-gray-600">
              Lista completa de alunos com matrículas ativas
            </p>
          </button>
          <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <FileTextIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Matrículas do Mês
            </h3>
            <p className="text-sm text-gray-600">
              Todas as matrículas realizadas no mês atual
            </p>
          </button>
          <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <FileTextIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Cursos Populares
            </h3>
            <p className="text-sm text-gray-600">
              Ranking dos cursos com mais alunos matriculados
            </p>
          </button>
          <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <FileTextIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Estatísticas Gerais
            </h3>
            <p className="text-sm text-gray-600">
              Resumo estatístico completo do sistema
            </p>
          </button>
        </div>
      </div>
    </div>;
}