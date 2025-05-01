import React, { useState, useRef } from 'react';
import { RotateCw, ThumbsUp, Clock, BarChart2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const RecommendationBox: React.FC = () => {
  const { recommendations, numberStatistics, generateNewRecommendation, loading, filteredResults } = useData();
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number, number: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Encontrar estatísticas para números recomendados
  const getNumberStatistics = (number: number) => {
    const stats = numberStatistics.find(stat => stat.number === number);
    if (!stats) return null;

    // Encontrar o índice do último sorteio onde o número apareceu
    const lastAppearanceIndex = filteredResults.findIndex(result => 
      result.dezenas.includes(number.toString().padStart(2, '0'))
    );

    return {
      ...stats,
      lastAppearance: lastAppearanceIndex === -1 ? filteredResults.length : lastAppearanceIndex
    };
  };

  const formatLastAppearance = (sorteios: number): string => {
    if (sorteios === 0) return "Último sorteio";
    if (sorteios === 1) return "1 sorteio atrás";
    return `${sorteios} sorteios atrás`;
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, number: number) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top;
    setTooltipPosition({ x, y, number });
  };

  const handleMouseLeave = () => {
    setTooltipPosition(null);
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
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/30 dark:to-yellow-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 transition-all overflow-hidden relative">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 opacity-20 backdrop-blur-3xl"></div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center relative z-10">
              <ThumbsUp size={16} className="text-green-600 mr-2" />
              Combinação Sugerida
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4 mb-5 relative z-10">
              <span className="money-icon" style={{ left: '2%', animationDelay: '0.2s' }}>$</span>
              <span className="money-icon" style={{ left: '15%', animationDelay: '0.7s' }}>$</span>
              <span className="money-icon" style={{ left: '30%', animationDelay: '0.3s' }}>$</span>
              <span className="money-icon" style={{ left: '50%', animationDelay: '1.1s' }}>$</span>
              <span className="money-icon" style={{ left: '75%', animationDelay: '0.5s' }}>$</span>
              <span className="money-icon" style={{ left: '92%', animationDelay: '0.9s' }}>$</span>
              
              {/* Organização triangular das bolas */}
              <div className="flex flex-col items-center w-full">
                {/* Primeira linha - 3 bolas */}
                <div className="flex justify-center gap-3 mb-4">
                  {recommendations[0].numbers.slice(0, 3).map(number => {
                    const stats = getNumberStatistics(number);
                    return (
                      <div 
                        key={number} 
                        className="relative group" 
                        onMouseEnter={(e) => handleMouseEnter(e, number)} 
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-110 transition-transform duration-300 hover:shadow-xl">
                          {number}
                        </div>
                        
                        {stats && (
                          <div className="absolute z-10 -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md border border-white dark:border-gray-800">
                            {stats.frequency}x
                          </div>
                        )}
                        
                        {/* Tooltip com estatísticas detalhadas - versão modernizada */}
                        {tooltipPosition && tooltipPosition.number === number && (
                          <div 
                            ref={tooltipRef}
                            className="fixed z-50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                            text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 
                            shadow-2xl w-52 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
                            style={{
                              left: `${tooltipPosition.x}px`,
                              top: `${tooltipPosition.y - 10}px`,
                              transform: 'translate(-50%, -100%)'
                            }}
                          >
                            {stats && (
                              <>
                                <div className="text-center mb-3">
                                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full 
                                        bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg 
                                        shadow-inner">
                                    {number}
                                  </span>
                                  <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    Estatísticas
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  {/* Barra de progresso para frequência */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium flex items-center">
                                        <BarChart2 size={12} className="mr-1.5 text-green-500" /> Frequência
                                      </span>
                                      <span className="text-xs font-bold">{stats.frequency}x</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full overflow-hidden">
                                    </div>
                                  </div>
                                  
                                  {/* Última aparição com ícone */}
                                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                                      <Clock size={12} className="mr-1.5 text-blue-500" /> Última aparição
                                    </span>
                                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                                      {formatLastAppearance(stats.lastAppearance)}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Porcentagem de chance destaque */}
                                <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 
                                            dark:from-green-500 dark:to-emerald-600 rounded-lg text-white 
                                            font-medium text-center shadow-sm">
                                  <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                                  <div className="text-base">{stats.percentage.toFixed(1)}%</div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Segunda linha - 2 bolas */}
                <div className="flex justify-center gap-3 mb-4">
                  {recommendations[0].numbers.slice(3, 5).map(number => {
                const stats = getNumberStatistics(number);
                return (
                  <div 
                    key={number} 
                    className="relative group" 
                    onMouseEnter={(e) => handleMouseEnter(e, number)} 
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-110 transition-transform duration-300 hover:shadow-xl">
                      {number}
                    </div>
                    
                    {stats && (
                      <div className="absolute z-10 -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md border border-white dark:border-gray-800">
                        {stats.frequency}x
                      </div>
                    )}
                    
                    {/* Tooltip com estatísticas detalhadas - versão modernizada */}
                    {tooltipPosition && tooltipPosition.number === number && (
                      <div 
                        ref={tooltipRef}
                        className="fixed z-50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                        text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 
                        shadow-2xl w-52 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
                        style={{
                          left: `${tooltipPosition.x}px`,
                          top: `${tooltipPosition.y - 10}px`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        {stats && (
                          <>
                            <div className="text-center mb-3">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full 
                                    bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg 
                                    shadow-inner">
                                {number}
                              </span>
                              <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                Estatísticas
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Barra de progresso para frequência */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium flex items-center">
                                    <BarChart2 size={12} className="mr-1.5 text-green-500" /> Frequência
                                  </span>
                                  <span className="text-xs font-bold">{stats.frequency}x</span>
                                </div>
                                <div className="w-full h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full overflow-hidden">
                                </div>
                              </div>
                              
                              {/* Última aparição com ícone */}
                              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                                <span className="flex items-center text-gray-700 dark:text-gray-300">
                                  <Clock size={12} className="mr-1.5 text-blue-500" /> Última aparição
                                </span>
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                  {formatLastAppearance(stats.lastAppearance)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Porcentagem de chance destaque */}
                            <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 
                                        dark:from-green-500 dark:to-emerald-600 rounded-lg text-white 
                                        font-medium text-center shadow-sm">
                              <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                              <div className="text-base">{stats.percentage.toFixed(1)}%</div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
                </div>
                
                {/* Terceira linha - 1 bola */}
                <div className="flex justify-center">
                  {recommendations[0].numbers.slice(5, 6).map(number => {
                    const stats = getNumberStatistics(number);
                    return (
                      <div 
                        key={number} 
                        className="relative group" 
                        onMouseEnter={(e) => handleMouseEnter(e, number)} 
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-110 transition-transform duration-300 hover:shadow-xl">
                          {number}
                        </div>
                        
                        {stats && (
                          <div className="absolute z-10 -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md border border-white dark:border-gray-800">
                            {stats.frequency}x
                          </div>
                        )}
                        
                        {/* Tooltip com estatísticas detalhadas - versão modernizada */}
                        {tooltipPosition && tooltipPosition.number === number && (
                          <div 
                            ref={tooltipRef}
                            className="fixed z-50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                            text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 
                            shadow-2xl w-52 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
                            style={{
                              left: `${tooltipPosition.x}px`,
                              top: `${tooltipPosition.y - 10}px`,
                              transform: 'translate(-50%, -100%)'
                            }}
                          >
                            {stats && (
                              <>
                                <div className="text-center mb-3">
                                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full 
                                        bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg 
                                        shadow-inner">
                                    {number}
                                  </span>
                                  <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    Estatísticas
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  {/* Barra de progresso para frequência */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium flex items-center">
                                        <BarChart2 size={12} className="mr-1.5 text-green-500" /> Frequência
                                      </span>
                                      <span className="text-xs font-bold">{stats.frequency}x</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full overflow-hidden">
                                    </div>
                                  </div>
                                  
                                  {/* Última aparição com ícone */}
                                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                                      <Clock size={12} className="mr-1.5 text-blue-500" /> Última aparição
                                    </span>
                                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                                      {formatLastAppearance(stats.lastAppearance)}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Porcentagem de chance destaque */}
                                <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 
                                            dark:from-green-500 dark:to-emerald-600 rounded-lg text-white 
                                            font-medium text-center shadow-sm">
                                  <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                                  <div className="text-base">{stats.percentage.toFixed(1)}%</div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-3">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-yellow-100 dark:from-green-900/40 dark:to-yellow-900/30 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">Índice de Confiança:</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{recommendations[0].confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic backdrop-blur-sm bg-white/20 dark:bg-black/10 py-2 px-3 rounded-md max-w-md mx-auto">{recommendations[0].reasoning}</p>
            </div>
          </div>

          {recommendations.length > 1 && (
            <div>
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Clock size={16} className="text-blue-500 mr-2" />
                Recomendações Anteriores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.slice(1).map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      {rec.numbers.map(number => (
                        <div
                          key={number}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded-full py-1 px-2 w-fit mx-auto">
                      Confiança: <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.confidence}%</span>
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