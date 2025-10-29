import React, { useState } from 'react';
import { SearchIcon, BellIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function Navbar() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  return <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="search" placeholder="Buscar alunos, cursos..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" aria-label="Busca global" />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-6">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notificações">
            <BellIcon className="w-6 h-6" />
          </button>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Menu do usuário" aria-expanded={showUserMenu}>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="font-medium">Admin</span>
            </button>
            {showUserMenu && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span>Perfil</span>
                </button>
                <button onClick={() => navigate('/login')} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>}
          </div>
        </div>
      </div>
    </header>;
}