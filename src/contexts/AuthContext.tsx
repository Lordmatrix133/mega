import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, signInWithEmail, signOut as supabaseSignOut, getCurrentUser } from '../lib/supabase';
import { User } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Função para carregar os dados completos do usuário
  const loadUserProfile = async (session: Session | null) => {
    if (!session) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData as User);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Verifica a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      loadUserProfile(session);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      loadUserProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser, session: authSession } = await signInWithEmail(email, password);
      if (!authUser || !authSession) throw new Error('Falha na autenticação');
      
      setUser(authUser as User);
      setSession(authSession);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    session,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 