import React, { useState } from 'react';
import { MegaSenaResult } from '../types';
import { formatCurrency } from '../utils/helpers';
import WinnersList from './WinnersList';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultDetailProps {
  result: MegaSenaResult;
  onClose: () => void;
}

const ResultDetail: React.FC<ResultDetailProps> = ({ result, onClose }) => {
  const [showWinners, setShowWinners] = useState(false);
  
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Concurso {result.concurso}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Data do Sorteio</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.data}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Local do Sorteio</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.local || "Não informado"}</p>
              </div>
            </div>

            {/* Dezenas sorteadas */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dezenas Sorteadas</p>
              <div className="flex flex-wrap gap-2">
                {result.dezenas.map((dezena, index) => (
                  <div 
                    key={index} 
                    className="mega-number"
                  >
                    {dezena}
                  </div>
                ))}
              </div>
            </div>

            {/* Ordem de sorteio */}
            {result.dezenasOrdemSorteio && result.dezenasOrdemSorteio.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ordem de Sorteio</p>
                <div className="flex flex-wrap gap-2">
                  {result.dezenasOrdemSorteio.map((dezena, index) => (
                    <div 
                      key={index} 
                      className="w-10 h-10 rounded-full bg-blue-600 text-white dark:bg-blue-600 dark:text-white flex items-center justify-center font-bold"
                    >
                      {dezena}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premiações */}
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Premiações</p>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {result.premiacoes.map((premiacao, index) => (
                  <div key={index} className="py-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{premiacao.descricao || premiacao.acertos}</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(Number(premiacao.valorPremio || premiacao.premio || 0))}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {premiacao.ganhadores === 0 ? (
                        <span>Não houve ganhadores</span>
                      ) : (
                        <span>{premiacao.ganhadores} {premiacao.ganhadores === 1 ? 'ganhador' : 'ganhadores'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão para mostrar/esconder ganhadores por cidade */}
            <button
              className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowWinners(!showWinners)}
            >
              <span className="font-medium">Ver ganhadores por cidade</span>
              {showWinners ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Lista de ganhadores por cidade (condicional) */}
            {showWinners && <WinnersList result={result} />}

            {/* Status */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Próximo Concurso</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.dataProximoConcurso || "Não informado"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prêmio Estimado</p>
                  <p className="font-bold text-xl text-green-600 dark:text-green-400">
                    {formatCurrency(Number(result.valorEstimadoProximoConcurso || 0))}
                  </p>
                </div>
              </div>
              {result.acumulou && (
                <div className="mt-3 acumulou-banner">
                  <span className="money-icon" style={{ left: '10%', animationDelay: '0s' }}>$</span>
                  <span className="money-icon" style={{ left: '20%', animationDelay: '0.5s' }}>$</span>
                  <span className="money-icon" style={{ left: '35%', animationDelay: '1.2s' }}>$</span>
                  <span className="money-icon" style={{ left: '55%', animationDelay: '0.8s' }}>$</span>
                  <span className="money-icon" style={{ left: '70%', animationDelay: '0.3s' }}>$</span>
                  <span className="money-icon" style={{ left: '85%', animationDelay: '1.5s' }}>$</span>
                  ACUMULOU!
                </div>
              )}
            </div>

            {/* Outras modalidades específicas */}
            {(result.trevos && result.trevos.length > 0) && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Trevos</p>
                <div className="flex flex-wrap gap-2">
                  {result.trevos.map((trevo, index) => (
                    <div 
                      key={index} 
                      className="rounded-full bg-purple-600 text-white dark:bg-purple-600 dark:text-white flex items-center justify-center font-bold p-2"
                    >
                      {trevo}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.timeCoracao && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time do Coração</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.timeCoracao}</p>
              </div>
            )}

            {result.mesSorte && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mês da Sorte</p>
                <p className="font-medium text-gray-900 dark:text-white">{result.mesSorte}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetail; 