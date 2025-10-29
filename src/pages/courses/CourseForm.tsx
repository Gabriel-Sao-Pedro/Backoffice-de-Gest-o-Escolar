import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
export function CourseForm() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    cargaHoraria: '',
    status: 'Ativo'
  });
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
      console.log('Salvando curso:', formData);
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