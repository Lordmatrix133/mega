import { MegaSenaResult, NumberStatistics } from '../types';

export const calculateNumberStatistics = (results: MegaSenaResult[]): NumberStatistics[] => {
  const numberStats: NumberStatistics[] = Array.from({ length: 60 }, (_, i) => ({
    number: i + 1,
    frequency: 0,
    percentage: 0,
    lastAppearance: Infinity,
  }));

  results.forEach((result, resultIndex) => {
    result.dezenas.forEach((number: string) => {
      const index = parseInt(number) - 1;
      numberStats[index].frequency += 1;
      
      if (numberStats[index].lastAppearance === Infinity) {
        numberStats[index].lastAppearance = resultIndex;
      }
    });
  });

  const totalDraws = results.length;
  
  numberStats.forEach(stat => {
    stat.percentage = (stat.frequency / totalDraws) * 100;
    
    if (stat.lastAppearance === Infinity) {
      stat.lastAppearance = totalDraws;
    }
  });

  return numberStats;
};

export const getFrequencyColor = (frequency: number, maxFrequency: number): string => {
  const ratio = frequency / maxFrequency;
  
  if (ratio < 0.2) return '#313695';
  if (ratio < 0.4) return '#4575B4';
  if (ratio < 0.6) return '#74ADD1';
  if (ratio < 0.8) return '#F46D43';
  return '#A50026';
};

export const generateRecommendation = (numberStats: NumberStatistics[]): number[] => {
  const weightedStats = [...numberStats].map(stat => {
    const frequencyScore = stat.frequency * 0.7;
    const lastAppearanceScore = stat.lastAppearance * 0.3;
    
    return {
      ...stat,
      score: frequencyScore + lastAppearanceScore
    };
  });
  
  const sortedStats = weightedStats.sort((a, b) => b.score - a.score);
  
  const highProbabilityNumbers = sortedStats.slice(0, 20);
  const mediumProbabilityNumbers = sortedStats.slice(20, 40);
  const lowProbabilityNumbers = sortedStats.slice(40, 60);
  
  const recommended = [
    ...getRandomElements(highProbabilityNumbers, 3),
    ...getRandomElements(mediumProbabilityNumbers, 2),
    ...getRandomElements(lowProbabilityNumbers, 1),
  ].map(stat => stat.number);
  
  return recommended.sort((a, b) => a - b);
};

export const getRandomElements = <T>(array: T[], count: number): T[] => {
  // Criar uma cópia para não modificar o array original
  const tempArray = [...array];
  const result: T[] = [];
  
  // Implementação do Fisher-Yates (Knuth) shuffle algorithm
  for (let i = 0; i < Math.min(count, tempArray.length); i++) {
    // Gerar índice aleatório entre i e o final do array
    const randomIndex = i + Math.floor(Math.random() * (tempArray.length - i));
    
    // Trocar elementos nas posições i e randomIndex
    [tempArray[i], tempArray[randomIndex]] = [tempArray[randomIndex], tempArray[i]];
    
    // Adicionar o elemento ao resultado
    result.push(tempArray[i]);
  }
  
  return result;
};

export const formatCurrency = (value: string | number | undefined | null): string => {
  // Se for undefined ou null, retornar 0 formatado
  if (value === undefined || value === null) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(0);
  }
  
  // Se for string, tentar converter para número
  if (typeof value === 'string') {
    // Tratar string vazia
    if (value.trim() === '') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(0);
    }
    
    // Tentar extrair número da string
    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
    
    // Se for NaN, retornar 0 formatado
    if (isNaN(numericValue)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(0);
    }
    
    value = numericValue;
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  try {
    // Verificar se está no formato brasileiro (DD/MM/YYYY)
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Criar a data no formato correto: YYYY-MM-DD
        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return new Intl.DateTimeFormat('pt-BR').format(date);
      }
    }
    
    // Tentar como data ISO ou outro formato
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  } catch (error) {
    console.warn(`Erro ao formatar data: ${dateString}`, error);
    return dateString; // Retorna a string original se houver erro
  }
};

// Função para obter e formatar dados do próximo sorteio
export const getNextDrawDetails = (dateString: string): { 
  date: Date, 
  formattedDay: string, 
  formattedMonth: string, 
  diaSemana: string,
  isDrawDay: boolean 
} => {
  let drawDate: Date;
  
  // Verificar se a string de data é válida
  if (!dateString || dateString.trim() === '') {
    // Se não tiver data, usar a data atual
    drawDate = new Date();
    console.warn('Data do sorteio não informada, usando data atual como fallback');
  } else {
    // Converter a data para objeto Date
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Formato brasileiro: DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-11
        const year = parseInt(parts[2], 10);
        
        // Validação básica da data
        if (isNaN(day) || isNaN(month) || isNaN(year) || 
            day < 1 || day > 31 || month < 0 || month > 11 || year < 2000) {
          console.warn(`Data inválida: ${dateString}, usando data atual como fallback`);
          drawDate = new Date();
        } else {
          drawDate = new Date(year, month, day, 20, 0, 0);
        }
      } else {
        // Tentar interpretar como uma data de outro formato
        drawDate = new Date(dateString);
        if (isNaN(drawDate.getTime())) {
          console.warn(`Formato de data não reconhecido: ${dateString}, usando data atual`);
          drawDate = new Date();
        }
        drawDate.setHours(20, 0, 0, 0);
      }
    } else {
      // Tentar como data ISO ou outro formato
      drawDate = new Date(dateString);
      if (isNaN(drawDate.getTime())) {
        console.warn(`Data inválida: ${dateString}, usando data atual como fallback`);
        drawDate = new Date();
      }
      drawDate.setHours(20, 0, 0, 0);
    }
  }
  
  // Garantir que a data sempre retorne informações válidas
  const formattedDay = drawDate.getDate().toString().padStart(2, '0');
  const formattedMonth = (drawDate.getMonth() + 1).toString().padStart(2, '0');
  
  // Array dos dias da semana em português
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dayOfWeek = drawDate.getDay();
  const diaSemana = diasSemana[dayOfWeek];
  
  // Verificar se é um dia oficial de sorteio da Mega-Sena (terça, quinta, sábado)
  const isDrawDay = dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6; // 2 = terça, 4 = quinta, 6 = sábado
  
  return {
    date: drawDate,
    formattedDay,
    formattedMonth,
    diaSemana,
    isDrawDay
  };
};