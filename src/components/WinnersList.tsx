import React from 'react';
import { MegaSenaResult } from '../types';
import { MapPin } from 'lucide-react';

interface WinnersListProps {
  result: MegaSenaResult;
}

const WinnersList: React.FC<WinnersListProps> = ({ result }) => {
  // Se não tiver ganhadores, mostra uma mensagem
  const hasWinners = result.premiacoes.some(p => p.ganhadores > 0);
  
  if (!hasWinners) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">Não houve ganhadores neste concurso.</p>
      </div>
    );
  }
  
  // Verifica se temos informações detalhadas de localização
  const hasDetailedLocations = result.localGanhadores && result.localGanhadores.length > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ganhadores por Cidade</h3>
      
      {hasDetailedLocations ? (
        <div className="space-y-4">
          {/* Mostrando localização detalhada quando disponível */}
          {result.localGanhadores!.map((local, index) => (
            <div key={index} className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <MapPin className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {local.ganhadores} {local.ganhadores === 1 ? 'ganhador' : 'ganhadores'} em {local.municipio || 'Não informado'} - {local.uf}
                </p>
                {local?.nomeFantasiaUL && local.nomeFantasiaUL.length > 0 && (
                  <span className="text-xs text-zinc-500 block">
                    Lotérica: {local.nomeFantasiaUL}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mostrar informações gerais quando não tiver localização detalhada */}
          {result.premiacoes.map((premiacao, index) => {
            if (premiacao.ganhadores <= 0) return null;
            
            return (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  {premiacao.descricao || premiacao.acertos}
                </div>
                
                {premiacao.ganhadores === 1 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    1 ganhador {result.local ? `em ${result.local.includes('em') ? result.local.split('em')[1]?.trim() : result.local}` : ''}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {premiacao.ganhadores} ganhadores
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Mostrar informação de estados premiados, se disponível */}
      {result.estadosPremiados && result.estadosPremiados.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estados premiados: {result.estadosPremiados.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default WinnersList; 