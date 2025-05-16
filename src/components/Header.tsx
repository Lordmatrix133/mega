import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import megaSenaLogo from '../favicon/logo-mega-sena-em-png.png';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark'  // Modo claro é o padrão agora
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Aplicar modo claro por padrão ao iniciar o componente
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white shadow-lg transition-all w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={megaSenaLogo} alt="Mega Sena" className="w-7 h-7 object-contain" />
                </div>
              </div>
              <h1 className="text-xl font-bold">Mega Sena Analyzer</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-white hover:text-yellow-200 transition-colors">
              Painel
            </Link>
            <a href="#ball-selector" className="text-white hover:text-yellow-200 transition-colors">
              Registrar Jogo
            </a>
            <a href="#statistics" className="text-white hover:text-yellow-200 transition-colors">
              Estatísticas
            </a>
            <a href="#recommendations" className="text-white hover:text-yellow-200 transition-colors">
              Recomendações
            </a>
            <button
              onClick={toggleTheme}
              className="text-white hover:text-yellow-200 transition-colors"
              aria-label="Alternar modo escuro"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
              aria-label="Sair"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-md hover:bg-green-700 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-700 dark:bg-green-900 shadow-inner w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Painel
            </Link>
            <a 
              href="#ball-selector" 
              className="block px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Registrar Jogo
            </a>
            <a 
              href="#statistics" 
              className="block px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Estatísticas
            </a>
            <a 
              href="#recommendations" 
              className="block px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recomendações
            </a>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors flex items-center"
            >
              {isDarkMode ? (
                <>
                  <Sun size={20} className="mr-2" /> Modo Claro
                </>
              ) : (
                <>
                  <Moon size={20} className="mr-2" /> Modo Escuro
                </>
              )}
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors flex items-center"
            >
              <LogOut size={20} className="mr-2" /> Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;