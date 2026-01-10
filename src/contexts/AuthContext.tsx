import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

type Role = 'admin' | 'secretaria' | 'professor' | 'recepcionista' | 'aluno';

type AuthContextType = {
  isAuthenticated: boolean;
  role: Role;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('admin');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se há token ao carregar
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // Aqui você pode decodificar o token para obter a role, se necessário
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      role,
      loading,
      login: async (username: string, password: string): Promise<boolean> => {
        try {
          const response = await authAPI.login(username, password);
          
          // Salvar tokens
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          // Atualizar estado
          setIsAuthenticated(true);
          setRole('admin'); // Você pode extrair a role do token ou do response
          
          return true;
        } catch (error) {
          console.error('Erro no login:', error);
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
