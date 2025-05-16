import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import megaSenaLogo from '../favicon/logo-mega-sena-em-png.png';
import { useAuth } from '../contexts/AuthContext';
import { signUpWithEmail } from '../lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        if (!fullName.trim()) {
          throw new Error('O nome é obrigatório');
        }
        await signUpWithEmail(email, password, fullName);
        setError('Verifique seu email para confirmar o cadastro');
        setLoading(false);
        return;
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Tratamento de erros específicos do Supabase
      if (err.message?.includes('Email not confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha inválidos');
      } else if (err.message?.includes('Email already registered')) {
        setError('Este email já está cadastrado');
      } else if (err.message?.includes('Password should be at least 6 characters')) {
        setError('A senha deve ter pelo menos 6 caracteres');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cifrões animados no fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="login-money-icon text-green-500/20 text-4xl" style={{ left: '10%', top: '20%', animationDelay: '0s' }}>$</span>
        <span className="login-money-icon text-green-500/20 text-4xl" style={{ left: '25%', top: '30%', animationDelay: '0.7s' }}>$</span>
        <span className="login-money-icon text-green-500/20 text-4xl" style={{ left: '40%', top: '15%', animationDelay: '1.4s' }}>$</span>
        <span className="login-money-icon text-green-500/20 text-4xl" style={{ left: '75%', top: '25%', animationDelay: '2.1s' }}>$</span>
        <span className="login-money-icon text-green-500/20 text-4xl" style={{ left: '85%', top: '35%', animationDelay: '2.8s' }}>$</span>
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-6 transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={megaSenaLogo} alt="Mega Sena" className="w-14 h-14 object-contain" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta!'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Cadastre-se para acessar o Analisador da Mega Sena'
              : 'Faça login para acessar o Analisador da Mega Sena'
            }
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 
                           border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg
                           bg-white
                           transition-all duration-300 ease-in-out
                           focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
                           focus:outline-none focus:shadow-none
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Seu nome completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 
                         border border-gray-300 
                         placeholder-gray-500 text-gray-900 rounded-lg
                         bg-white
                         transition-all duration-300 ease-in-out
                         focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
                         focus:outline-none focus:shadow-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 
                           border border-gray-300
                           placeholder-gray-500 text-gray-900 rounded-lg
                           bg-white
                           transition-all duration-300 ease-in-out
                           focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
                           focus:outline-none focus:shadow-none
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500
                           hover:text-gray-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 
                             border border-gray-300
                             placeholder-gray-500 text-gray-900 rounded-lg
                             bg-white
                             transition-all duration-300 ease-in-out
                             focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500
                             focus:outline-none focus:shadow-none
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                     text-sm font-medium rounded-lg text-white
                     bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                     transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isSignUp ? 'Cadastrar' : 'Entrar'
            )}
          </button>

          <div className="mt-4 text-center">
            {isSignUp ? (
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                Voltar para o login
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Cadastre-se
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 