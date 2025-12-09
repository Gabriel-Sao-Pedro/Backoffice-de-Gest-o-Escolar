import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Role as UserRole, findUserByEmailAndPassword, seedDefaultUsers } from '../services/auth';

type Role = UserRole;

type AuthContextType = {
  isAuthenticated: boolean;
  role: Role;
  login: (opts?: { role?: Role; email?: string; password?: string }) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'auth.session.v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('admin');

  useEffect(() => {
    try {
  // Garantir usuários padrão
  seedDefaultUsers();
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { isAuthenticated: boolean; role: Role };
        setIsAuthenticated(!!parsed.isAuthenticated);
        setRole(parsed.role ?? 'admin');
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated, role }));
  }, [isAuthenticated, role]);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      role,
      login: (opts) => {
        if (opts?.email && opts?.password) {
          const user = findUserByEmailAndPassword(opts.email, opts.password);
          if (!user) return false;
          setIsAuthenticated(true);
          setRole(user.role);
          return true;
        }
        // fallback para login sem credenciais (mantém comportamento antigo)
        setIsAuthenticated(true);
        if (opts?.role) setRole(opts.role);
        return true;
      },
      logout: () => {
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
