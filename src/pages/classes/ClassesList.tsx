import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { getTurmas, initDb } from '../../services/db';

export function ClassesList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [turmas, setTurmas] = useState(getTurmas());

  useEffect(() => {
    initDb();
    setTurmas(getTurmas());
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return turmas.filter((t) => t.nome.toLowerCase().includes(q) || String(t.ano).includes(q));
  }, [search, turmas]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const items = filtered.slice(start, end);

  useEffect(() => setPage(1), [search, pageSize]);

  return (
    <section className="space-y-4" aria-labelledby="classes-heading">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="classes-heading" className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600">Gerencie os agrupamentos de alunos</p>
        </div>
        <Link to="/turmas/nova" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="w-5 h-5" /> Nova Turma
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 flex items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome/ano..."
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg"
          />
          <label className="text-sm text-gray-700">Itens por página</label>
          <select className="px-2 py-1 border border-gray-300 rounded-lg" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-blue-700"><Link to={`/turmas/${t.id}`}>{t.nome}</Link></td>
                  <td className="px-6 py-4 text-sm">{t.ano}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">Mostrando {total === 0 ? 0 : start + 1} a {end} de {total} resultados</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>Anterior</button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <button className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Próximo</button>
          </div>
        </div>
      </div>
    </section>
  );
}
