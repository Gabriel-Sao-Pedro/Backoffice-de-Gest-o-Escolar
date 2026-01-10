import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para refresh automático do token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 e não for uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Tentar novamente a requisição original
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, limpar tokens e redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API de Autenticação
export const authAPI = {
  login: async (username: string, password: string): Promise<{ access: string; refresh: string; user: any }> => {
    const response = await axios.post(`${API_BASE_URL}/api/token/`, {
      username,
      password,
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data;
  },
};

// Tipos baseados no modelo Django
export interface Aluno {
  id: number;
  nome: string;
  rg: string;
  cpf: string;
  data_nascimento: string;
  celular: string;
  foto: string | null;
}

export interface Curso {
  id: number;
  codigo_curso: string;
  descricao: string;
  nivel: 'B' | 'I' | 'A';
}

export interface Matricula {
  id: number;
  aluno: number;
  curso: number;
  periodo: 'M' | 'V' | 'N';
}

export interface MatriculaDetalhada extends Matricula {
  aluno_nome?: string;
  curso_descricao?: string;
}

export interface Avaliacao {
  id: number;
  matricula: number;
  nota1: number;
  nota2: number;
  nota3: number;
  media: number;
  situacao?: string;
  data_criacao: string;
}

export interface AtividadeAvaliativa {
  id: number;
  matricula: number;
  tipo: 'A' | 'P' | 'T';
  tipo_display: string;
  titulo: string;
  descricao: string;
  nota: number | null;
  data_entrega: string | null;
  entregue: boolean;
  data_criacao: string;
}

// APIs de Alunos
export const alunosAPI = {
  // Listar todos os alunos
  listar: async (version?: 'v2'): Promise<Aluno[]> => {
    const params = version ? { version } : {};
    const response = await api.get('/alunos/', { params });
    return response.data;
  },

  // Obter um aluno específico
  obter: async (id: number): Promise<Aluno> => {
    const response = await api.get(`/alunos/${id}/`);
    return response.data;
  },

  // Criar um novo aluno
  criar: async (aluno: Omit<Aluno, 'id'>): Promise<Aluno> => {
    const response = await api.post('/alunos/', aluno);
    return response.data;
  },

  // Atualizar um aluno
  atualizar: async (id: number, aluno: Partial<Aluno>): Promise<Aluno> => {
    const response = await api.put(`/alunos/${id}/`, aluno);
    return response.data;
  },

  // Atualizar parcialmente um aluno
  atualizarParcial: async (id: number, aluno: Partial<Aluno>): Promise<Aluno> => {
    const response = await api.patch(`/alunos/${id}/`, aluno);
    return response.data;
  },

  // Deletar um aluno
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/alunos/${id}/`);
  },

  // Listar matrículas de um aluno
  listarMatriculas: async (id: number): Promise<{ curso: string; periodo: string }[]> => {
    const response = await api.get(`/alunos/${id}/matriculas/`);
    return response.data;
  },

  // Upload de foto (FormData)
  uploadFoto: async (id: number, foto: File): Promise<Aluno> => {
    const formData = new FormData();
    formData.append('foto', foto);
    const response = await api.patch(`/alunos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// APIs de Cursos
export const cursosAPI = {
  // Listar todos os cursos
  listar: async (): Promise<Curso[]> => {
    const response = await api.get('/cursos/');
    return response.data;
  },

  // Obter um curso específico
  obter: async (id: number): Promise<Curso> => {
    const response = await api.get(`/cursos/${id}/`);
    return response.data;
  },

  // Criar um novo curso
  criar: async (curso: Omit<Curso, 'id'>): Promise<Curso> => {
    const response = await api.post('/cursos/', curso);
    return response.data;
  },

  // Atualizar um curso
  atualizar: async (id: number, curso: Partial<Curso>): Promise<Curso> => {
    const response = await api.put(`/cursos/${id}/`, curso);
    return response.data;
  },

  // Atualizar parcialmente um curso
  atualizarParcial: async (id: number, curso: Partial<Curso>): Promise<Curso> => {
    const response = await api.patch(`/cursos/${id}/`, curso);
    return response.data;
  },

  // Deletar um curso
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/cursos/${id}/`);
  },

  // Listar alunos matriculados em um curso
  listarAlunosMatriculados: async (id: number): Promise<{ aluno_nome: string }[]> => {
    const response = await api.get(`/cursos/${id}/matriculas/`);
    return response.data;
  },
};

// APIs de Matrículas
export const matriculasAPI = {
  // Listar todas as matrículas
  listar: async (): Promise<Matricula[]> => {
    const response = await api.get('/matriculas/');
    return response.data;
  },

  // Obter uma matrícula específica
  obter: async (id: number): Promise<Matricula> => {
    const response = await api.get(`/matriculas/${id}/`);
    return response.data;
  },

  // Criar uma nova matrícula
  criar: async (matricula: Omit<Matricula, 'id'>): Promise<Matricula> => {
    const response = await api.post('/matriculas/', matricula);
    return response.data;
  },

  // Atualizar uma matrícula
  atualizar: async (id: number, matricula: Partial<Matricula>): Promise<Matricula> => {
    const response = await api.put(`/matriculas/${id}/`, matricula);
    return response.data;
  },

  // Atualizar parcialmente uma matrícula
  atualizarParcial: async (id: number, matricula: Partial<Matricula>): Promise<Matricula> => {
    const response = await api.patch(`/matriculas/${id}/`, matricula);
    return response.data;
  },

  // Deletar uma matrícula
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/matriculas/${id}/`);
  },
};

// APIs de Avaliações
export const avaliacoesAPI = {
  // Listar todas as avaliações
  listar: async (): Promise<Avaliacao[]> => {
    const response = await api.get('/avaliacoes/');
    return response.data;
  },

  // Obter uma avaliação específica
  obter: async (id: number): Promise<Avaliacao> => {
    const response = await api.get(`/avaliacoes/${id}/`);
    return response.data;
  },

  // Criar uma nova avaliação
  criar: async (avaliacao: Omit<Avaliacao, 'id' | 'media'>): Promise<Avaliacao> => {
    const response = await api.post('/avaliacoes/', avaliacao);
    return response.data;
  },

  // Atualizar uma avaliação
  atualizar: async (id: number, avaliacao: Partial<Avaliacao>): Promise<Avaliacao> => {
    const response = await api.put(`/avaliacoes/${id}/`, avaliacao);
    return response.data;
  },

  // Atualizar parcialmente uma avaliação
  atualizarParcial: async (id: number, avaliacao: Partial<Avaliacao>): Promise<Avaliacao> => {
    const response = await api.patch(`/avaliacoes/${id}/`, avaliacao);
    return response.data;
  },

  // Deletar uma avaliação
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/avaliacoes/${id}/`);
  },
};

// APIs de Atividades Avaliativas
export const atividadesAPI = {
  // Listar todas as atividades
  listar: async (): Promise<AtividadeAvaliativa[]> => {
    const response = await api.get('/atividades/');
    return response.data;
  },

  // Obter uma atividade específica
  obter: async (id: number): Promise<AtividadeAvaliativa> => {
    const response = await api.get(`/atividades/${id}/`);
    return response.data;
  },

  // Criar uma nova atividade
  criar: async (atividade: Omit<AtividadeAvaliativa, 'id' | 'tipo_display'>): Promise<AtividadeAvaliativa> => {
    const response = await api.post('/atividades/', atividade);
    return response.data;
  },

  // Atualizar uma atividade
  atualizar: async (id: number, atividade: Partial<AtividadeAvaliativa>): Promise<AtividadeAvaliativa> => {
    const response = await api.put(`/atividades/${id}/`, atividade);
    return response.data;
  },

  // Atualizar parcialmente uma atividade
  atualizarParcial: async (id: number, atividade: Partial<AtividadeAvaliativa>): Promise<AtividadeAvaliativa> => {
    const response = await api.patch(`/atividades/${id}/`, atividade);
    return response.data;
  },

  // Deletar uma atividade
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/atividades/${id}/`);
  },
}

// Função auxiliar para obter matrículas com informações detalhadas
export const obterMatriculasDetalhadas = async (): Promise<MatriculaDetalhada[]> => {
  const [matriculas, alunos, cursos] = await Promise.all([
    matriculasAPI.listar(),
    alunosAPI.listar(),
    cursosAPI.listar(),
  ]);

  return matriculas
    .map((m) => {
      const aluno = alunos.find((a) => a.id === m.aluno);
      const curso = cursos.find((c) => c.id === m.curso);
      return {
        ...m,
        aluno_nome: aluno?.nome,
        curso_descricao: curso?.descricao,
      };
    })
    .filter((m) => m.curso_descricao); // Filtrar matrículas órfãs (curso deletado)
};

// Mapeamento de níveis
export const getNivelLabel = (nivel: 'B' | 'I' | 'A'): string => {
  const map = {
    B: 'Básico',
    I: 'Intermediário',
    A: 'Avançado',
  };
  return map[nivel];
};

// Mapeamento de períodos
export const getPeriodoLabel = (periodo: 'M' | 'V' | 'N'): string => {
  const map = {
    M: 'Matutino',
    V: 'Vespertino',
    N: 'Noturno',
  };
  return map[periodo];
};

export default api;
