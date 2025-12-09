// Serviço de autenticação simples baseado em localStorage

export type Role = 'admin' | 'secretaria' | 'professor' | 'recepcionista' | 'aluno';

export type StoredUser = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const USERS_KEY = 'auth.users.v1';

export function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
  const users = JSON.parse(raw) as Partial<StoredUser>[];
    // Migração: itens antigos podem não ter role; assumir 'aluno'
    return users.map((u) => ({
      name: u.name ?? '',
      email: u.email ?? '',
      password: u.password ?? '',
      role: (u.role as Role) ?? 'aluno',
    }));
  } catch {
    return [];
  }
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user: Omit<StoredUser, 'role'> & { role?: Role }): { ok: true } | { ok: false; error: string } {
  const users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: 'E-mail já cadastrado.' };
  }
  users.push({ ...user, role: user.role ?? 'aluno' });
  saveUsers(users);
  return { ok: true };
}

export function findUserByEmailAndPassword(email: string, password: string): StoredUser | undefined {
  const users = loadUsers();
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
}

export function seedDefaultUsers() {
  const users = loadUsers();
  const ensure = (user: StoredUser) => {
    if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push(user);
    }
  };
  ensure({
    name: 'Secretaria Padrão',
    email: 'secretaria@escola.local',
    password: '123456',
    role: 'secretaria',
  });
  ensure({
    name: 'Aluno Padrão',
    email: 'aluno@escola.local',
    password: '123456',
    role: 'aluno',
  });
  saveUsers(users);
}
