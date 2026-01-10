import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, XIcon } from 'lucide-react';
import { alunosAPI, cursosAPI, matriculasAPI, obterMatriculasDetalhadas, Aluno, Curso } from '../../services/api';

export function EnrollmentForm() {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState<Aluno[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [matriculasExistentes, setMatriculasExistentes] = useState<Array<{aluno: number, curso: number}>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    aluno: '',
    curso: '',
    periodo: 'M' as 'M' | 'V' | 'N',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [alunosData, cursosData, matriculasData] = await Promise.all([
          alunosAPI.listar(),
          cursosAPI.listar(),
          obterMatriculasDetalhadas(),
        ]);
        setStudents(alunosData);
        setCourses(cursosData);
        // Extrair apenas os pares aluno-curso para validação
        setMatriculasExistentes(matriculasData.map(m => ({ aluno: m.aluno, curso: m.curso })));
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        alert('Erro ao carregar dados. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.aluno) {
      newErrors.aluno = 'Selecione um aluno';
    }
    
    if (!formData.curso) {
      newErrors.curso = 'Selecione um curso';
    }
    
    // Verificar se o aluno já está matriculado neste curso
    if (formData.aluno && formData.curso) {
      const jaMatriculado = matriculasExistentes.some(
        m => m.aluno === Number(formData.aluno) && m.curso === Number(formData.curso)
      );
      if (jaMatriculado) {
        newErrors.curso = 'Este aluno já está matriculado neste curso';
      }
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
      setSubmitting(true);
      
      await matriculasAPI.criar({
        aluno: Number(formData.aluno),
        curso: Number(formData.curso),
        periodo: formData.periodo,
      });
      
      alert('Matrícula criada com sucesso!');
      navigate('/matriculas');
    } catch (err: any) {
      console.error('Erro ao criar matrícula:', err);
      const mensagemErro = err.response?.data ? 
        JSON.stringify(err.response.data) : 
        'Erro ao criar matrícula. Verifique os dados e tente novamente.';
      alert(mensagemErro);
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Matrícula</h1>
          <p className="text-gray-600 mt-1">Matricule um aluno em um curso</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="aluno" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Aluno *
              </label>
              <select 
                id="aluno" 
                name="aluno" 
                value={formData.aluno} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.aluno ? 'border-red-500' : 'border-gray-300'
                }`} 
                aria-required="true" 
                aria-invalid={!!errors.aluno}
              >
                <option value="">Selecione um aluno</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nome} - CPF: {student.cpf}
                  </option>
                ))}
              </select>
              {errors.aluno && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.aluno}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Curso *
              </label>
              <select 
                id="curso" 
                name="curso" 
                value={formData.curso} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.curso ? 'border-red-500' : 'border-gray-300'
                }`} 
                aria-required="true" 
                aria-invalid={!!errors.curso}
              >
                <option value="">Selecione um curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.descricao} - Código: {course.codigo_curso}
                  </option>
                ))}
              </select>
              {errors.curso && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.curso}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-2">
                Período *
              </label>
              <select 
                id="periodo" 
                name="periodo" 
                value={formData.periodo} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="M">Matutino</option>
                <option value="V">Vespertino</option>
                <option value="N">Noturno</option>
              </select>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
            <button 
              type="button" 
              onClick={() => navigate('/matriculas')} 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={submitting}
            >
              <XIcon className="w-4 h-4" />
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              <SaveIcon className="w-4 h-4" />
              {submitting ? 'Criando...' : 'Criar Matrícula'}
            </button>
          </div>
        </form>
      )}
    </div>;
}