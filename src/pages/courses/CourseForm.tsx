import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
import { cursosAPI, Curso, getNivelLabel } from '../../services/api';

export function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    codigo_curso: '',
    descricao: '',
    nivel: 'B' as 'B' | 'I' | 'A',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const carregarCurso = async () => {
        try {
          setLoadingData(true);
          const curso = await cursosAPI.obter(Number(id));
          setFormData({
            codigo_curso: curso.codigo_curso,
            descricao: curso.descricao,
            nivel: curso.nivel,
          });
        } catch (err) {
          console.error('Erro ao carregar curso:', err);
          alert('Erro ao carregar dados do curso.');
        } finally {
          setLoadingData(false);
        }
      };
      carregarCurso();
    }
  }, [isEditing, id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigo_curso.trim()) {
      newErrors.codigo_curso = 'Código é obrigatório';
    } else if (formData.codigo_curso.length > 10) {
      newErrors.codigo_curso = 'Código deve ter no máximo 10 caracteres';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length > 100) {
      newErrors.descricao = 'Descrição deve ter no máximo 100 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && id) {
        await cursosAPI.atualizar(Number(id), formData);
        alert('Curso atualizado com sucesso!');
      } else {
        await cursosAPI.criar(formData);
        alert('Curso cadastrado com sucesso!');
      }
      
      navigate('/cursos');
    } catch (err: any) {
      console.error('Erro ao salvar curso:', err);
      const mensagemErro = err.response?.data ? 
        JSON.stringify(err.response.data) : 
        'Erro ao salvar curso. Verifique os dados e tente novamente.';
      alert(mensagemErro);
    } finally {
      setLoading(false);
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
      
      {loadingData ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="codigo_curso" className="block text-sm font-medium text-gray-700 mb-2">
                  Código do Curso *
                </label>
                <input 
                  id="codigo_curso" 
                  name="codigo_curso" 
                  type="text" 
                  value={formData.codigo_curso} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.codigo_curso ? 'border-red-500' : 'border-gray-300'
                  }`} 
                  placeholder="Ex: MAT101"
                  maxLength={10}
                  aria-required="true" 
                  aria-invalid={!!errors.codigo_curso} 
                />
                {errors.codigo_curso && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.codigo_curso}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-2">
                  Nível *
                </label>
                <select 
                  id="nivel" 
                  name="nivel" 
                  value={formData.nivel} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="B">Básico</option>
                  <option value="I">Intermediário</option>
                  <option value="A">Avançado</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Curso *
              </label>
              <input 
                id="descricao" 
                name="descricao" 
                type="text" 
                value={formData.descricao} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300'
                }`} 
                placeholder="Digite a descrição do curso (máximo 100 caracteres)"
                maxLength={100}
                aria-required="true" 
                aria-invalid={!!errors.descricao} 
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.descricao}
                </p>
              )}
            </div>
          </div>
          
          {/* Footer com botões */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
            <button 
              type="button" 
              onClick={() => navigate('/cursos')} 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <XIcon className="w-4 h-4" />
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <SaveIcon className="w-4 h-4" />
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
            </button>
          </div>
        </form>
      )}
    </div>;
}