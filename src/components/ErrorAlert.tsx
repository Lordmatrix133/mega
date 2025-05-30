import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';

/**
 * Componente que exibe uma mensagem de erro com opção de tentar novamente
 */
const ErrorAlert: React.FC = () => {
  const { error, refreshData, loading } = useData();
  
  if (!error) return null;
  
  // Formatar a mensagem de erro para ser mais amigável
  let friendlyError = error;
  
  // Substituir mensagens técnicas por mensagens mais amigáveis
  if (error.includes('Unexpected non-whitespace character') || 
      error.includes('Erro ao processar JSON') ||
      error.includes('JSON')) {
    friendlyError = 'Houve um problema com o formato dos dados da API. Isso geralmente é temporário.';
  } else if (error.includes('NetworkError') || error.includes('Failed to fetch')) {
    friendlyError = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
  } else if (error.includes('status 5')) {
    friendlyError = 'O servidor da loteria está com problemas no momento. Tente novamente mais tarde.';
  } else if (error.includes('status 4')) {
    friendlyError = 'Não foi possível acessar os dados da loteria. O serviço pode estar indisponível.';
  }
  
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 dark:bg-red-900/20 dark:border-red-500">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-200">
            <strong>Erro ao carregar dados:</strong> {friendlyError}
          </p>
          <div className="mt-2">
            <button
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
              onClick={() => refreshData()}
              disabled={loading}
            >
              <RefreshCw size={12} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert; 