import React from 'react';
import { User } from '../types/user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Crown, User as UserIcon } from 'lucide-react';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps): JSX.Element | null {
  if (!user) return null;

  const isAdmin = user.roles === 'admin';
  const userName = user.full_name || user.email || '';
  const userEmail = user.email || '';

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl shadow-md border 
      ${isAdmin 
        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'} 
      min-w-[240px]`}>
      <div className="relative group">
        {isAdmin && (
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-orange-400/20 rounded-full blur opacity-10 transition-opacity duration-1000" />
        )}
        <Avatar className={isAdmin
          ? "relative h-12 w-12 shadow-md transform hover:scale-105 transition-all duration-300"
          : "h-11 w-11 border-2 border-green-500/20"}>
          <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
          <AvatarFallback 
            className={isAdmin
              ? 'bg-gradient-to-br from-gray-50 to-white text-yellow-600/90 relative'
              : 'bg-green-50 text-green-600'}>
            {isAdmin ? (
              <div className="relative">
                <Crown className="w-7 h-7 relative z-10 text-yellow-500/90" />
              </div>
            ) : (
              <UserIcon className="w-6 h-6" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
          ${isAdmin 
            ? 'bg-yellow-500/90' 
            : 'bg-green-500'} 
          rounded-full ring-2 ring-white dark:ring-gray-800`} />
      </div>

      <div className="flex-1">
        <div className="flex flex-col space-y-0.5">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Nome:</span>
            <span className={`text-sm ${isAdmin ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-900 dark:text-white'}`}>
              {userName}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Cargo:</span>
            <span className={isAdmin
              ? 'text-sm font-bold flex items-center gap-1'
              : 'text-sm text-purple-600 dark:text-purple-400'}>
              {isAdmin ? (
                <>
                  <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Administrador
                  </span>
                  <Crown className="w-3.5 h-3.5 inline-block text-yellow-500" />
                </>
              ) : 'Usuário comum'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Email:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo; 