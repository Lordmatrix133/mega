import React from 'react';
import { MegaSenaResult, NumberStatistics } from '../types';
import { calculateNumberStatistics, getFrequencyColor } from '../utils/helpers';

interface NumberFrequencyChartProps {
  results: MegaSenaResult[];
}

const NumberFrequencyChart: React.FC<NumberFrequencyChartProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Sem dados para análise.
        </p>
      </div>
    );
  }

  // Calcular estatísticas
  const stats = calculateNumberStatistics(results);
  
  // Encontrar frequência máxima para ajustar a escala de cores
  const maxFrequency = Math.max(...stats.map(s => s.frequency));
  
  // Agrupar números em grupos de 10 para melhor visualização
  const chunks: NumberStatistics[][] = [];
  for (let i = 0; i < stats.length; i += 10) {
    chunks.push(stats.slice(i, i + 10));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Frequência de Dezenas (últimos {results.length} sorteios)
      </h3>
      
      <div className="overflow-x-auto">
        {chunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="mb-4">
            <div className="flex items-end space-x-2">
              {chunk.map(stat => {
                // Calcular altura proporcional à frequência máxima (de 10% a 100%)
                const heightPercentage = 10 + (stat.frequency / maxFrequency) * 90;
                const barHeightClass = `h-[${heightPercentage}%]`;
                const color = getFrequencyColor(stat.frequency, maxFrequency);
                
                return (
                  <div key={stat.number} className="flex flex-col items-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {stat.frequency}
                    </div>
                    <div className="relative h-24 w-8">
                      <div 
                        className="absolute bottom-0 w-full rounded-t"
                        style={{ height: `${heightPercentage}%`, backgroundColor: color }}
                      />
                    </div>
                    <div className="mt-1 font-medium text-xs text-gray-800 dark:text-gray-200">
                      {stat.number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Baixa frequência</span>
          <span>Alta frequência</span>
        </div>
        <div className="w-full h-2 mt-1 bg-gradient-to-r from-blue-600 via-green-500 to-red-600 rounded"></div>
      </div>
    </div>
  );
};

export default NumberFrequencyChart; 