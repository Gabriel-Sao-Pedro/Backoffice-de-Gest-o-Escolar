import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, XIcon, UploadIcon, UserIcon } from 'lucide-react';
export function StudentForm() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    celular: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    foto: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00)';
    }
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }
    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Aqui você faria a chamada à API para salvar os dados
      console.log('Salvando aluno:', formData);
      navigate('/alunos');
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Foto */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <UserIcon className="w-16 h-16 text-gray-400" />}
              </div>
              <label className="mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <UploadIcon className="w-4 h-4" />
                <span className="text-sm">Carregar Foto</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Carregar foto do aluno" />
              </label>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite o nome completo" aria-required="true" aria-invalid={!!errors.nome} />
                {errors.nome && <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.nome}
                  </p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input id="cpf" name="cpf" type="text" value={formData.cpf} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`} placeholder="000.000.000-00" aria-required="true" aria-invalid={!!errors.cpf} />
                  {errors.cpf && <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.cpf}
                    </p>}
                </div>
                <div>
                  <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento *
                  </label>
                  <input id="dataNascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.dataNascimento ? 'border-red-500' : 'border-gray-300'}`} aria-required="true" aria-invalid={!!errors.dataNascimento} />
                  {errors.dataNascimento && <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.dataNascimento}
                    </p>}
                </div>
              </div>
            </div>
          </div>
          {/* Contato */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-2">
                  Celular *
                </label>
                <input id="celular" name="celular" type="tel" value={formData.celular} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.celular ? 'border-red-500' : 'border-gray-300'}`} placeholder="(00) 00000-0000" aria-required="true" aria-invalid={!!errors.celular} />
                {errors.celular && <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.celular}
                  </p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="email@exemplo.com" aria-required="true" aria-invalid={!!errors.email} />
                {errors.email && <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>}
              </div>
            </div>
          </div>
          {/* Endereço */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Endereço
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="00000-000" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-2">
                    Logradouro
                  </label>
                  <input id="logradouro" name="logradouro" type="text" value={formData.logradouro} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rua, Avenida, etc." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apto, Bloco, etc." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome do bairro" />
                </div>
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome da cidade" />
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select id="estado" name="estado" value={formData.estado} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Selecione</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer com botões */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
          <button type="button" onClick={() => navigate('/alunos')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
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