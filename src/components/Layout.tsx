import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BookOpenIcon, ClipboardListIcon, UploadIcon, BarChartIcon, MenuIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const { logout } = useAuth();
  return <div className="min-h-screen flex flex-col">
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-blue-600 px-3 py-2 bg-white text-blue-700">
        Pular para o conteúdo principal
      </a>
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MenuIcon className="w-6 h-6 md:hidden" />
            <img src="/logo.svg" alt="Logo da Empresa" className="h-8 w-auto hidden sm:block" />
            <h1 className="text-xl font-bold">Sistema Escolar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="hidden md:inline">Admin</span>
            </div>
            <button type="button" className="p-2 hover:bg-blue-700 rounded-full" onClick={() => { logout(); navigate('/login'); }} aria-label="Sair e ir para login">
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1" aria-label="Navegação lateral">
            <Link to="/" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/alunos" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/alunos') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <UsersIcon className="w-5 h-5" />
              <span>Alunos</span>
            </Link>
            <Link to="/cursos" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/cursos') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <BookOpenIcon className="w-5 h-5" />
              <span>Cursos</span>
            </Link>
            <Link to="/matriculas" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/matriculas') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <ClipboardListIcon className="w-5 h-5" />
              <span>Matrículas</span>
            </Link>
            {/** Link de Turmas removido (funcionalidades integradas em Cursos) */}
            <Link to="/importar-exportar" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/importar-exportar') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <UploadIcon className="w-5 h-5" />
              <span>Importar/Exportar</span>
            </Link>
            <Link to="/relatorios" className={`flex items-center space-x-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActive('/relatorios') ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100'}`}>
              <BarChartIcon className="w-5 h-5" />
              <span>Relatórios</span>
            </Link>
          </nav>
        </aside>
        <main id="conteudo-principal" className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>;
}