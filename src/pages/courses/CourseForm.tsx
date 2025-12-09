import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
import { addCourse, addEnrollment, getCourses, getEnrollments, getStudents, removeEnrollmentByStudentCourse, updateCourse } from '../../services/db';
export function CourseForm() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEditing = !!id;
  const courseId = isEditing ? Number(id) : null;
  const existing = useMemo(() => (courseId ? getCourses().find(c => c.id === courseId) : undefined), [courseId]);
  const [formData, setFormData] = useState({
    codigo: existing?.codigo ?? '',
    nome: existing?.nome ?? '',
    descricao: existing?.descricao ?? '',
    cargaHoraria: existing?.cargaHoraria?.toString() ?? '',
    status: existing?.status ?? 'Ativo'
  });
  const allStudents = getStudents();
  const currentEnrollments = getEnrollments().filter(e => (courseId ? e.courseId === courseId : false));
  const initiallySelected = new Set(currentEnrollments.map(e => e.studentId));
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(initiallySelected));
  const [query, setQuery] = useState('');
  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStudents;
    return allStudents.filter(s => s.nome.toLowerCase().includes(q) || s.cpf.includes(q));
  }, [allStudents, query]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do curso é obrigatório';
    }
    if (!formData.cargaHoraria) {
      newErrors.cargaHoraria = 'Carga horária é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing && courseId) {
        updateCourse(courseId, {
          codigo: formData.codigo,
          nome: formData.nome,
          descricao: formData.descricao,
          cargaHoraria: Number(formData.cargaHoraria),
          status: formData.status as 'Ativo' | 'Inativo',
        });
        // Sincronizar matrículas
        const before = new Set(currentEnrollments.map(e => e.studentId));
        // Remover os que foram desmarcados
        for (const sid of Array.from(before)) {
          if (!selectedIds.has(sid)) removeEnrollmentByStudentCourse(sid, courseId);
        }
        // Adicionar os novos marcados
        for (const sid of Array.from(selectedIds)) {
          if (!before.has(sid)) addEnrollment({ studentId: sid, courseId, dataMatricula: new Date().toISOString().slice(0,10), status: 'Ativa' });
        }
      } else {
        const created = addCourse({
          codigo: formData.codigo,
          nome: formData.nome,
          descricao: formData.descricao,
          cargaHoraria: Number(formData.cargaHoraria),
          status: formData.status as 'Ativo' | 'Inativo',
        });
        // Criar matrículas para selecionados
        for (const sid of Array.from(selectedIds)) {
          addEnrollment({ studentId: sid, courseId: created.id, dataMatricula: new Date().toISOString().slice(0,10), status: 'Ativa' });
        }
      }
      navigate('/cursos');
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Curso' : 'Novo Curso'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do curso' : 'Preencha os dados do novo curso'}
          </p>
        </div>
      </div>
  <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                Código do Curso *
              </label>
              <input id="codigo" name="codigo" type="text" value={formData.codigo} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.codigo ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: MAT101" aria-required="true" aria-invalid={!!errors.codigo} />
              {errors.codigo && <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.codigo}
                </p>}
            </div>
            <div>
              <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700 mb-2">
                Carga Horária (horas) *
              </label>
              <input id="cargaHoraria" name="cargaHoraria" type="number" value={formData.cargaHoraria} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.cargaHoraria ? 'border-red-500' : 'border-gray-300'}`} placeholder="60" min="1" aria-required="true" aria-invalid={!!errors.cargaHoraria} />
              {errors.cargaHoraria && <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.cargaHoraria}
                </p>}
            </div>
          </div>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Curso *
            </label>
            <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite o nome do curso" aria-required="true" aria-invalid={!!errors.nome} />
            {errors.nome && <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.nome}
              </p>}
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Descreva o conteúdo e objetivos do curso..." />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Gestão de alunos no curso */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Alunos deste curso</h3>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou CPF" className="px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div className="max-h-64 overflow-auto border border-gray-200 rounded">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selecionar</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(s => {
                    const checked = selectedIds.has(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">
                          <input type="checkbox" checked={checked} onChange={(e) => {
                            setSelectedIds(prev => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(s.id); else next.delete(s.id);
                              return next;
                            });
                          }} />
                        </td>
                        <td className="px-4 py-2 text-sm">{s.nome}</td>
                        <td className="px-4 py-2 text-sm">{s.cpf}</td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm text-gray-500">Nenhum aluno encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">Marque os alunos que devem estar matriculados neste curso. Ao salvar, as matrículas serão criadas ou removidas conforme necessário.</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
          <button type="button" onClick={() => navigate('/cursos')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <XIcon className="w-4 h-4" />
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <SaveIcon className="w-4 h-4" />
            {isEditing ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>;
}