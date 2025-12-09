import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTurma } from '../../services/db';

export function ClassForm() {
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTurma({ nome, ano, courseId: undefined });
    navigate('/turmas');
  };

  return (
    <section className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg p-6" aria-labelledby="class-form">
      <h1 id="class-form" className="text-xl font-bold mb-4">Nova Turma</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <input type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => navigate('/turmas')} className="px-4 py-2 border border-gray-300 rounded-lg">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Salvar</button>
        </div>
      </form>
    </section>
  );
}
