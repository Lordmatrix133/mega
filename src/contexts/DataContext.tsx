import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { MegaSenaResult, NumberStatistics, DateRange, RecommendationSet } from '../types';
import { fetchMegaSenaResults } from '../services/api';
import { calculateNumberStatistics, generateRecommendation } from '../utils/helpers';

interface DataContextType {
  results: MegaSenaResult[];
  filteredResults: MegaSenaResult[];
  numberStatistics: NumberStatistics[];
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  recommendations: RecommendationSet[];
  setDateRange: (range: DateRange) => void;
  generateNewRecommendation: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<MegaSenaResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<MegaSenaResult[]>([]);
  const [numberStatistics, setNumberStatistics] = useState<NumberStatistics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
  });
  const [recommendations, setRecommendations] = useState<RecommendationSet[]>([]);
  
  // Referência para controlar se as recomendações já foram geradas nesta sessão
  const recommendationsGeneratedRef = useRef<boolean>(false);

  // Fetch data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Filter results when date range changes
  useEffect(() => {
    if (results.length > 0) {
      filterResultsByDateRange();
    }
  }, [dateRange, results]);

  // Calculate statistics when filtered results change
  useEffect(() => {
    if (filteredResults.length > 0) {
      const stats = calculateNumberStatistics(filteredResults);
      setNumberStatistics(stats);
      
      // Gerar recomendação apenas se ainda não foi gerada nesta sessão
      if (stats.length > 0 && !recommendationsGeneratedRef.current) {
        generateNewRecommendationInternal(stats);
        recommendationsGeneratedRef.current = true;
      }
    }
  }, [filteredResults]);

  const refreshData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Adicionamos cabeçalhos para evitar cache e um timestamp
      const timestamp = new Date().getTime();
      const data = await fetchMegaSenaResults(timestamp);
      
      if (!data || data.length === 0) {
        throw new Error('Não foi possível obter os dados da Mega Sena');
      }
      
      setResults(data);
      
      // Definir range de datas baseado nos dados disponíveis
      if (data.length > 0 && !dateRange.startDate) {
        const oldestDate = data[data.length - 1].data;
        const newestDate = data[0].data;
        
        setDateRange({
          startDate: oldestDate,
          endDate: newestDate,
        });
      } else {
        // Se range já definido, filtrar os resultados
        setFilteredResults(data);
      }
      
      console.log('Dados obtidos com sucesso!', {
        concurso: data[0].concurso,
        dataUltimoSorteio: data[0].data,
        dataProximoSorteio: data[0].dataProximoConcurso
      });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao conectar à API';
      setError(`Falha ao buscar resultados da Mega Sena. ${errorMessage}`);
      console.error('Erro na busca de dados:', err);
      
      // Limpar os dados parciais que possam existir
      setResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filterResultsByDateRange = (): void => {
    if (!dateRange.startDate && !dateRange.endDate) {
      setFilteredResults(results);
      return;
    }
    
    // Função auxiliar para converter qualquer formato de data para objeto Date
    const convertToDate = (dateStr: string): Date | null => {
      try {
        if (!dateStr) return null;
        
        // Se for formato brasileiro DD/MM/YYYY
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            return new Date(
              parseInt(parts[2]), // ano
              parseInt(parts[1]) - 1, // mês (0-11)
              parseInt(parts[0]) // dia
            );
          }
        }
        
        // Tentar outros formatos (ISO, etc)
        return new Date(dateStr);
      } catch (error) {
        console.warn(`Erro ao converter data: ${dateStr}`, error);
        return null;
      }
    };
    
    // Converter as datas de filtro
    const startDate = dateRange.startDate ? convertToDate(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? convertToDate(dateRange.endDate) : null;
    
    const filtered = results.filter(result => {
      // Converter a data do resultado
      const resultDate = convertToDate(result.data);
      if (!resultDate) return false;
      
      // Aplicar os filtros
      const afterStartDate = !startDate || resultDate >= startDate;
      const beforeEndDate = !endDate || resultDate <= endDate;
      
      return afterStartDate && beforeEndDate;
    });
    
    setFilteredResults(filtered);
  };

  // Função interna para gerar recomendações
  const generateNewRecommendationInternal = (stats = numberStatistics): void => {
    if (stats.length === 0) return;
    
    const recommendedNumbers = generateRecommendation(stats);
    
    // Encontrar estatísticas dos números recomendados
    const selectedStats = recommendedNumbers.map(num => 
      stats.find(stat => stat.number === num)!
    );
    
    // Calcular estatísticas médias
    const avgFrequency = selectedStats.reduce((sum, stat) => sum + stat.frequency, 0) / selectedStats.length;
    const avgPercentage = selectedStats.reduce((sum, stat) => sum + stat.percentage, 0) / selectedStats.length;
    
    // Encontrar números quentes (alta frequência) e frios (baixa frequência)
    const hotNumbers = selectedStats
      .filter(stat => stat.frequency > avgFrequency)
      .map(stat => stat.number)
      .sort((a, b) => a - b);
    
    const coldNumbers = selectedStats
      .filter(stat => stat.frequency <= avgFrequency)
      .map(stat => stat.number)
      .sort((a, b) => a - b);
    
    // Gerar raciocínio dinâmico baseado nas estatísticas
    let reasoning = `Combinação baseada em análise estatística de ${filteredResults.length} sorteios. `;
    
    if (hotNumbers.length > 0) {
      reasoning += `Números quentes (${hotNumbers.join(', ')}) com frequência acima da média. `;
    }
    
    if (coldNumbers.length > 0) {
      reasoning += `Números frios (${coldNumbers.join(', ')}) selecionados para equilíbrio. `;
    }
    
    reasoning += `Probabilidade média de ${avgPercentage.toFixed(1)}% por número.`;
    
    const newRecommendation: RecommendationSet = {
      numbers: recommendedNumbers,
      confidence: Math.round(Math.random() * 30 + 70), // Confiança aleatória entre 70-100%
      reasoning,
    };
    
    setRecommendations([newRecommendation, ...recommendations.slice(0, 4)]);
  };

  // Função pública exposta pelo contexto
  const generateNewRecommendation = (): void => {
    generateNewRecommendationInternal();
  };

  const value = {
    results,
    filteredResults,
    numberStatistics,
    loading,
    error,
    dateRange,
    recommendations,
    setDateRange,
    generateNewRecommendation,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};