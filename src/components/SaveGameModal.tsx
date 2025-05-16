import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface SaveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gameName: string) => void;
  selectedNumbers: number[];
  loading?: boolean;
}

const SaveGameModal: React.FC<SaveGameModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedNumbers,
  loading = false 
}) => {
  const [gameName, setGameName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim()) {
      onSave(gameName.trim());
      setGameName('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"></div>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl border border-green-200 dark:border-green-800 transform transition-all max-w-md w-11/12 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute -top-4 -right-4 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Salvar Jogo
        </h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Números selecionados:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.sort((a, b) => a - b).map((number) => (
              <span
                key={number}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold"
              >
                {number}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gameName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Jogo
            </label>
            <input
              type="text"
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Meu Jogo da Sorte"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!gameName.trim() || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveGameModal; 