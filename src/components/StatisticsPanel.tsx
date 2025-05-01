import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { getFrequencyColor } from '../utils/helpers';
import NumberFrequencyChart from './NumberFrequencyChart';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';

const StatisticsPanel: React.FC = () => {
  const { numberStatistics, loading, filteredResults } = useData();
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed' | 'chart'>('basic');
  
  const maxFrequency = useMemo(() => {
    if (numberStatistics.length === 0) return 0;
    return Math.max(...numberStatistics.map(stat => stat.frequency));
  }, [numberStatistics]);

  const sortedStats = useMemo(() => {
    return [...numberStatistics].sort((a, b) => b.frequency - a.frequency);
  }, [numberStatistics]);
  
  const topNumbers = useMemo(() => {
    return sortedStats.slice(0, 5);
  }, [sortedStats]);
  
  const bottomNumbers = useMemo(() => {
    return [...sortedStats].slice(-5).reverse();
  }, [sortedStats]);

  const getNumberStyle = (frequency: number) => {
    const bgColor = getFrequencyColor(frequency, maxFrequency);
    // Cores escuras têm luminosidade menor que 50%
    
    return {
      backgroundColor: bgColor,
      color: 'white' // Sempre branco para garantir contraste
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Estatísticas dos Números</h2>
        
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg">
          <button 
            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'basic' 
              ? 'bg-green-500 text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            onClick={() => setActiveTab('basic')}
          >
            <Activity size={18} className="inline mr-1" /> Básico
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'detailed' 
              ? 'bg-green-500 text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            onClick={() => setActiveTab('detailed')}
          >
            <TrendingUp size={18} className="inline mr-1" /> Detalhado
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'chart' 
              ? 'bg-green-500 text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            onClick={() => setActiveTab('chart')}
          >
            <BarChart2 size={18} className="inline mr-1" /> Gráfico
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando estatísticas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'basic' && (
            <>
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Números Mais Frequentes</h3>
                <div className="flex flex-wrap gap-2">
                  {topNumbers.map(stat => (
                    <div 
                      key={stat.number} 
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm mb-1 shadow-lg transform hover:scale-110 transition-all duration-200"
                        style={getNumberStyle(stat.frequency)}
                      >
                        {stat.number}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{stat.frequency}x</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Números Menos Frequentes</h3>
                <div className="flex flex-wrap gap-2">
                  {bottomNumbers.map(stat => (
                    <div 
                      key={stat.number} 
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm mb-1 shadow-lg transform hover:scale-110 transition-all duration-200"
                        style={getNumberStyle(stat.frequency)}
                      >
                        {stat.number}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{stat.frequency}x</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'detailed' && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Mapa de Calor dos Números</h3>
              <div className="grid grid-cols-10 gap-2">
                {numberStatistics.map(stat => (
                  <div 
                    key={stat.number}
                    className="relative group"
                  >
                    <div
                      className="aspect-square rounded-lg flex items-center justify-center text-sm font-medium shadow-md transform hover:scale-110 transition-all duration-200 cursor-pointer"
                      style={getNumberStyle(stat.frequency)}
                    >
                      {stat.number}
                    </div>
                    
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded-md py-2 px-3 hidden group-hover:block z-10 min-w-[120px] backdrop-blur-sm">
                      <div className="text-center space-y-1">
                        <div className="font-semibold text-sm">Número {stat.number}</div>
                        <div className="border-t border-white/20 my-1"></div>
                        <div>Frequência: {stat.frequency}x</div>
                        <div>Porcentagem: {stat.percentage.toFixed(1)}%</div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex flex-col items-center space-y-2">
                <div className="w-full max-w-md h-2 rounded-full bg-gradient-to-r from-[#313695] via-[#4575B4] via-[#74ADD1] via-[#F46D43] to-[#A50026]"></div>
                <div className="flex justify-between w-full max-w-md text-xs text-gray-600 dark:text-gray-400">
                  <span>Menor Frequência</span>
                  <span>Maior Frequência</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Passe o mouse sobre os números para ver detalhes
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'chart' && (
            <NumberFrequencyChart results={filteredResults} />
          )}
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;