import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 flex items-center justify-center">
                  🍀
                </div>
              </div>
              <h1 className="text-xl font-bold">Mega Sena Analyzer</h1>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#dashboard" className="text-white hover:text-yellow-200 transition-colors">
              Painel
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
        <div className="md:hidden bg-green-700 dark:bg-green-900 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#dashboard" 
              className="block px-3 py-2 rounded-md text-white hover:bg-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Painel
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;