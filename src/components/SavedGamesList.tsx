import React from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { SavedGame } from '../lib/supabase';

interface SavedGamesListProps {
  games: SavedGame[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectGame: (game: SavedGame) => void;
  onDeleteGame: (gameId: string) => void;
}

const SavedGamesList: React.FC<SavedGamesListProps> = ({
  games,
  isExpanded,
  onToggleExpand,
  onSelectGame,
  onDeleteGame,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full px-4 py-3 flex items-center justify-between bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
      >
        <span className="font-medium text-gray-800 dark:text-white">Jogos Salvos ({games.length})</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {games.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
              Nenhum jogo salvo ainda
            </div>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">{game.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectGame(game)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => onDeleteGame(game.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Excluir jogo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {game.numbers.sort((a, b) => a - b).map((number) => (
                    <span
                      key={number}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold"
                    >
                      {number}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Salvo em: {new Date(game.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SavedGamesList; 