import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends Omit<SupabaseUser, 'user_metadata'> {
  full_name: string;
  roles: 'admin' | 'user';
  online_status: 'online' | 'offline' | 'away';
  user_metadata: {
    avatar_url?: string;
  };
}

export type OnlineStatus = 'online' | 'offline' | 'away'; 