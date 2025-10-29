import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, BookOpenIcon, ClipboardListIcon, UploadIcon, BarChartIcon, MenuIcon, UserIcon, LogOutIcon } from 'lucide-react';
export function Layout() {
  const location = useLocation();
  const isActive = path => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  return <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MenuIcon className="w-6 h-6 md:hidden" />
            <h1 className="text-xl font-bold">Sistema Escolar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="hidden md:inline">Admin</span>
            </div>
            <button className="p-2 hover:bg-blue-700 rounded-full">
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1">
            <Link to="/" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/alunos" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/alunos') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UsersIcon className="w-5 h-5" />
              <span>Alunos</span>
            </Link>
            <Link to="/cursos" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/cursos') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <BookOpenIcon className="w-5 h-5" />
              <span>Cursos</span>
            </Link>
            <Link to="/matriculas" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/matriculas') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <ClipboardListIcon className="w-5 h-5" />
              <span>Matrículas</span>
            </Link>
            <Link to="/importar-exportar" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/importar-exportar') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <UploadIcon className="w-5 h-5" />
              <span>Importar/Exportar</span>
            </Link>
            <Link to="/relatorios" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive('/relatorios') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <BarChartIcon className="w-5 h-5" />
              <span>Relatórios</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>;
}