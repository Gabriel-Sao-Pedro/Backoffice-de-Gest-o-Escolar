import React, { useState } from 'react';
import { UploadIcon, DownloadIcon, FileTextIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
export function ImportExport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };
  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    // Simula processamento de importação
    setTimeout(() => {
      setImporting(false);
      setImportResult({
        success: true,
        message: `Arquivo "${file.name}" importado com sucesso! 150 registros processados.`
      });
      setFile(null);
    }, 2000);
  };
  const handleExport = (type: string) => {
    console.log(`Exportando ${type}...`);
    // Aqui você implementaria a lógica de exportação
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Importar e Exportar
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie dados em lote através de arquivos CSV
        </p>
      </div>
      {/* Importação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <UploadIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Importar Dados</h2>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {file ? <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <FileTextIcon className="w-4 h-4" />
                  <span className="font-medium">{file.name}</span>
                  <span>({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={handleImport} disabled={importing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {importing ? 'Importando...' : 'Importar Arquivo'}
                  </button>
                  <button onClick={() => setFile(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                </div>
              </div> : <>
                <p className="text-gray-600 mb-4">
                  Arraste e solte um arquivo CSV aqui ou clique para selecionar
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <UploadIcon className="w-4 h-4" />
                  Selecionar Arquivo
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" aria-label="Selecionar arquivo CSV" />
                </label>
              </>}
          </div>
          {importResult && <div className={`flex items-start gap-3 p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} role="alert">
              {importResult.success ? <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <p className={`text-sm ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {importResult.message}
              </p>
            </div>}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              Formato do arquivo CSV:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Primeira linha deve conter os cabeçalhos das colunas</li>
              <li>Campos separados por vírgula (,)</li>
              <li>Codificação UTF-8</li>
              <li>
                Campos obrigatórios: nome, cpf, data_nascimento, celular, email
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Exportação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <DownloadIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Exportar Dados</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => handleExport('alunos')} className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <DownloadIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Exportar Alunos
            </h3>
            <p className="text-sm text-gray-600">
              Download de todos os alunos cadastrados
            </p>
          </button>
          <button onClick={() => handleExport('cursos')} className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <DownloadIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Exportar Cursos
            </h3>
            <p className="text-sm text-gray-600">
              Download de todos os cursos disponíveis
            </p>
          </button>
          <button onClick={() => handleExport('matriculas')} className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <DownloadIcon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Exportar Matrículas
            </h3>
            <p className="text-sm text-gray-600">
              Download de todas as matrículas ativas
            </p>
          </button>
        </div>
      </div>
    </div>;
}