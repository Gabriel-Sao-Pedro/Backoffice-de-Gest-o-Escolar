import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, XIcon, UploadIcon, UserIcon } from 'lucide-react';
import { alunosAPI, Aluno } from '../../services/api';

export function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    celular: '',
    foto: null as File | null
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const carregarAluno = async () => {
        try {
          setLoadingData(true);
          const aluno = await alunosAPI.obter(Number(id));
          setFormData({
            nome: aluno.nome,
            cpf: aluno.cpf,
            rg: aluno.rg,
            data_nascimento: aluno.data_nascimento,
            celular: aluno.celular,
            foto: null
          });
          if (aluno.foto) {
            setPreviewUrl(aluno.foto);
          }
        } catch (err) {
          console.error('Erro ao carregar aluno:', err);
          alert('Erro ao carregar dados do aluno.');
        } finally {
          setLoadingData(false);
        }
      };
      carregarAluno();
    }
  }, [isEditing, id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatação de CPF
    if (name === 'cpf') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }
    
    // Formatação de RG
    if (name === 'rg') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 9) {
        formattedValue = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
      }
    }
    
    // Formatação de Celular
    if (name === 'celular') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        formattedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido (deve conter 11 dígitos)';
    }
    
    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    } else if (!/^\d{9}$/.test(formData.rg.replace(/\D/g, ''))) {
      newErrors.rg = 'RG inválido (deve conter 9 dígitos)';
    }
    
    if (!formData.data_nascimento) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    }
    
    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular é obrigatório';
    } else if (!/^\d{11}$/.test(formData.celular.replace(/\D/g, ''))) {
      newErrors.celular = 'Celular inválido (deve conter 11 dígitos)';
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
      
      // Preparar dados (remover caracteres especiais)
      const dadosAluno = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg.replace(/\D/g, ''),
        data_nascimento: formData.data_nascimento,
        celular: formData.celular.replace(/\D/g, ''),
      };

      let alunoSalvo: Aluno;
      
      if (isEditing && id) {
        alunoSalvo = await alunosAPI.atualizar(Number(id), dadosAluno);
      } else {
        alunoSalvo = await alunosAPI.criar(dadosAluno);
      }

      // Upload da foto se houver
      if (formData.foto) {
        await alunosAPI.uploadFoto(alunoSalvo.id, formData.foto);
      }

      alert(isEditing ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
      navigate('/alunos');
    } catch (err: any) {
      console.error('Erro ao salvar aluno:', err);
      const mensagemErro = err.response?.data ? 
        JSON.stringify(err.response.data) : 
        'Erro ao salvar aluno. Verifique os dados e tente novamente.';
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do aluno' : 'Preencha os dados do novo aluno'}
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
            {/* Foto */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label className="mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <UploadIcon className="w-4 h-4" />
                  <span className="text-sm">Carregar Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    aria-label="Carregar foto do aluno" 
                  />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input 
                    id="nome" 
                    name="nome" 
                    type="text" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`} 
                    placeholder="Digite o nome completo (máximo 30 caracteres)"
                    maxLength={30}
                    aria-required="true" 
                    aria-invalid={!!errors.nome} 
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.nome}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input 
                      id="cpf" 
                      name="cpf" 
                      type="text" 
                      value={formData.cpf} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.cpf ? 'border-red-500' : 'border-gray-300'
                      }`} 
                      placeholder="000.000.000-00"
                      maxLength={14}
                      aria-required="true" 
                      aria-invalid={!!errors.cpf} 
                    />
                    {errors.cpf && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.cpf}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-2">
                      RG *
                    </label>
                    <input 
                      id="rg" 
                      name="rg" 
                      type="text" 
                      value={formData.rg} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.rg ? 'border-red-500' : 'border-gray-300'
                      }`} 
                      placeholder="00.000.000-0"
                      maxLength={12}
                      aria-required="true" 
                      aria-invalid={!!errors.rg} 
                    />
                    {errors.rg && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.rg}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dados Adicionais */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações Adicionais
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento *
                  </label>
                  <input 
                    id="data_nascimento" 
                    name="data_nascimento" 
                    type="date" 
                    value={formData.data_nascimento} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.data_nascimento ? 'border-red-500' : 'border-gray-300'
                    }`} 
                    aria-required="true" 
                    aria-invalid={!!errors.data_nascimento} 
                  />
                  {errors.data_nascimento && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.data_nascimento}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-2">
                    Celular *
                  </label>
                  <input 
                    id="celular" 
                    name="celular" 
                    type="tel" 
                    value={formData.celular} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.celular ? 'border-red-500' : 'border-gray-300'
                    }`} 
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    aria-required="true" 
                    aria-invalid={!!errors.celular} 
                  />
                  {errors.celular && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.celular}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer com botões */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
            <button 
              type="button" 
              onClick={() => navigate('/alunos')} 
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