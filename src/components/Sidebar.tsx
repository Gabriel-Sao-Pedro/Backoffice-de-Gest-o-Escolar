import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, UsersIcon, BookOpenIcon, GraduationCapIcon, UploadIcon, BarChart3Icon, SettingsIcon } from 'lucide-react';
const menuItems = [{
  path: '/',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
}, {
  path: '/alunos',
  label: 'Alunos',
  icon: UsersIcon
}, {
  path: '/cursos',
  label: 'Cursos',
  icon: BookOpenIcon
}, {
  path: '/matriculas',
  label: 'Matrículas',
  icon: GraduationCapIcon
}, {
  path: '/importar-exportar',
  label: 'Import/Export',
  icon: UploadIcon
}, {
  path: '/relatorios',
  label: 'Relatórios',
  icon: BarChart3Icon
}, {
  path: '/administracao',
  label: 'Administração',
  icon: SettingsIcon
}];
export function Sidebar() {
  const location = useLocation();
  return <aside className="w-64 bg-white border-r border-gray-200 flex flex-col" role="navigation" aria-label="Menu principal">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Gestão Escolar</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || item.path !== '/' && location.pathname.startsWith(item.path);
          return <li key={item.path}>
                <Link to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`} aria-current={isActive ? 'page' : undefined}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>;
        })}
        </ul>
      </nav>
    </aside>;
}