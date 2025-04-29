import React from 'react';
import { RotateCw, ThumbsUp, Clock, BarChart2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const RecommendationBox: React.FC = () => {
  const { recommendations, numberStatistics, generateNewRecommendation, loading } = useData();

  // Encontrar estatísticas para números recomendados
  const getNumberStatistics = (number: number) => {
    return numberStatistics.find(stat => stat.number === number);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Números Recomendados</h2>
        <button
          onClick={generateNewRecommendation}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
        >
          <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          Atualizar Sugestão
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Analisando dados...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          Nenhuma recomendação disponível ainda.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/30 dark:to-yellow-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 transition-all">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center">
              <ThumbsUp size={16} className="text-green-600 mr-2" />
              Combinação Sugerida
            </h3>
            
            <div className="flex flex-wrap justify-center gap-3 mb-4 relative">
              <span className="money-icon" style={{ left: '2%', animationDelay: '0.2s' }}>$</span>
              <span className="money-icon" style={{ left: '15%', animationDelay: '0.7s' }}>$</span>
              <span className="money-icon" style={{ left: '30%', animationDelay: '0.3s' }}>$</span>
              <span className="money-icon" style={{ left: '50%', animationDelay: '1.1s' }}>$</span>
              <span className="money-icon" style={{ left: '75%', animationDelay: '0.5s' }}>$</span>
              <span className="money-icon" style={{ left: '92%', animationDelay: '0.9s' }}>$</span>
              {recommendations[0].numbers.map(number => {
                const stats = getNumberStatistics(number);
                return (
                  <div key={number} className="relative group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-110 transition-transform">
                      {number}
                    </div>
                    
                    {stats && (
                      <div className="absolute z-10 -bottom-2 -right-2 bg-yellow-500 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {stats.frequency}x
                      </div>
                    )}
                    
                    {/* Tooltip com estatísticas detalhadas */}
                    {stats && (
                      <div className="tooltip bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 tooltip-center">
                        <div className="text-center font-medium border-b pb-2 mb-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                          Número {number}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                            <span className="flex items-center"><BarChart2 size={12} className="mr-1.5" /> Frequência:</span>
                            <span className="font-semibold">{stats.frequency} sorteios</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                            <span className="flex items-center"><Clock size={12} className="mr-1.5" /> Última aparição:</span>
                            <span className="font-semibold">{stats.lastAppearance} sorteios atrás</span>
                          </div>
                          <div className="text-center mt-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400 font-medium">
                            {stats.percentage.toFixed(1)}% de chance
                          </div>
                        </div>
                        <div className="tooltip-arrow left-1/2 -ml-1.5 -bottom-1.5"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Índice de Confiança: </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{recommendations[0].confidence}%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{recommendations[0].reasoning}</p>
            </div>
          </div>

          {recommendations.length > 1 && (
            <div>
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Recomendações Anteriores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.slice(1).map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-100 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                      {rec.numbers.map(number => (
                        <div
                          key={number}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-200 text-sm font-medium"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                      Confiança: {rec.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4 italic">
            Observação: Estas sugestões são baseadas na análise estatística dos sorteios anteriores, 
            considerando frequência e padrões temporais. Lembre-se que loteria é um jogo de azar e 
            resultados passados não garantem resultados futuros.
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationBox;