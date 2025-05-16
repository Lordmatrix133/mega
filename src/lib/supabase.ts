import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Faltam as variáveis de ambiente do Supabase. Verifique o arquivo .env');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Tipos para os dados do usuário
export type UserData = {
  id: string;
  email: string;
  full_name: string;
  roles: 'admin' | 'user';
  created_at: string;
  last_sign_in?: string;
  online_status: 'online' | 'offline' | 'away';
};

// Interface para os jogos salvos
export interface SavedGame {
  id: string;
  user_id: string;
  name: string;
  numbers: number[];
  created_at: string;
}

// Função auxiliar para verificar se o usuário está autenticado
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      // Buscar dados adicionais do usuário
      const { data: userData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      return {
        ...user,
        ...userData
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
};

// Função para fazer login com email/senha
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Buscar dados adicionais do usuário
    if (data.user) {
      const { data: userData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return { 
        user: { ...data.user, ...userData }, 
        session: data.session 
      };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função para fazer cadastro com email/senha
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            roles: 'user', // Papel padrão para novos usuários
            online_status: 'offline',
            email: email
          }
        ]);

      if (profileError) throw profileError;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};

// Função para fazer logout
export const signOut = async () => {
  try {
    // Atualizar status para offline
    const user = await getCurrentUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ online_status: 'offline' })
        .eq('id', user.id);
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Função para atualizar o status online
export const updateOnlineStatus = async (status: 'online' | 'offline' | 'away') => {
  try {
    const user = await getCurrentUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ online_status: status })
        .eq('id', user.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

// Função para salvar um novo jogo
export const saveGame = async (name: string, numbers: number[]) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('saved_games')
      .insert([
        {
          user_id: user.id,
          name,
          numbers,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar jogo:', error);
    throw error;
  }
};

// Função para carregar os jogos do usuário
export const loadUserGames = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('saved_games')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao carregar jogos:', error);
    throw error;
  }
};

// Função para excluir um jogo
export const deleteGame = async (gameId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('saved_games')
      .delete()
      .eq('id', gameId)
      .eq('user_id', user.id); // Garantir que o jogo pertence ao usuário

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir jogo:', error);
    throw error;
  }
}; 