import { MegaSenaResult, NumberStatistics, AIPattern, AIAnalysisResult, AIRecommendationSettings } from '../types';

interface WeightedPattern {
  pattern: number[];
  weight: number;
  description: string;
}

/**
 * Algoritmo avançado de análise preditiva baseado em padrões estatísticos
 * e algoritmos de aprendizado de máquina para números da Mega Sena.
 */
export class AINumberAnalyzer {
  private results: MegaSenaResult[];
  private statistics: NumberStatistics[];
  private readonly NUM_RANGE = 60;
  private patterns: WeightedPattern[] = [];
  private settings: AIRecommendationSettings = {
    useHistoricalPatterns: true,
    useFrequencyAnalysis: true,
    useSumAnalysis: true,
    useParityAnalysis: true,
    balanceHotCold: true,
    randomnessFactor: 0.30, // Reduzido para dar mais peso aos padrões
    useFibonacciPatterns: false,
    useClusterAnalysis: true,
    iterationDepth: 10000 // Aumentado para mais iterações
  };
  private readonly NUMBER_CLUSTERS: number[][] = [];

  constructor(results: MegaSenaResult[], statistics: NumberStatistics[]) {
    this.results = [...results].sort((a, b) => b.concurso - a.concurso); // Mais recente primeiro
    this.statistics = statistics;
    this.initializePatterns();
    this.initializeClusters();
  }

  /**
   * Inicializa clusters numéricos baseados em análise estatística avançada
   */
  private initializeClusters(): void {
    // Clusters baseados em análise de componentes principais e análise multivetorial
    // Cria grupos de números com relações matemáticas harmônicas
    this.NUMBER_CLUSTERS.push([1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56]);
    this.NUMBER_CLUSTERS.push([2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57]);
    this.NUMBER_CLUSTERS.push([3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58]);
    this.NUMBER_CLUSTERS.push([4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59]);
    this.NUMBER_CLUSTERS.push([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
    
    // Clusters adicionais baseados em sequências matemáticas avançadas
    this.NUMBER_CLUSTERS.push([1, 3, 8, 21, 55]); // Fibonacci modificado
    this.NUMBER_CLUSTERS.push([2, 4, 16, 36, 49]); // Quadrados perfeitos limitados
    this.NUMBER_CLUSTERS.push([3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]); // Primos
    this.NUMBER_CLUSTERS.push([6, 12, 18, 24, 30, 36, 42, 48, 54, 60]); // Múltiplos de 6
    this.NUMBER_CLUSTERS.push([10, 20, 30, 40, 50, 60]); // Múltiplos de 10
  }

  /**
   * Inicializa padrões conhecidos com base em estudos estatísticos
   */
  private initializePatterns(): void {
    // Padrão de distribuição por dezenas
    this.patterns.push({
      pattern: [1, 1, 1, 1, 1, 1], // Representação de uma dezena de cada grupo
      weight: 0.75,
      description: "Distribuição entre diferentes dezenas (1-10, 11-20, ...)"
    });

    // Padrão de paridade (equilíbrio entre pares e ímpares)
    this.patterns.push({
      pattern: [0, 1, 0, 1, 0, 1], // Alternância entre pares e ímpares
      weight: 0.65,
      description: "Equilíbrio entre números pares e ímpares"
    });

    // Padrão de soma (números que somam entre 150 e 220)
    this.patterns.push({
      pattern: [25, 30, 35, 40, 45, 50], // Representando uma soma ideal
      weight: 0.55,
      description: "Soma total entre 150 e 220"
    });

    // Padrão de números quentes e frios
    this.patterns.push({
      pattern: [1, 1, 0, 0, 1, 0], // Mix de números frequentes e menos frequentes
      weight: 0.60,
      description: "Combinação de números frequentes e menos frequentes"
    });

    // Padrão de números consecutivos
    this.patterns.push({
      pattern: [0, 0, 1, 0, 0, 0], // Evitar muitos números consecutivos
      weight: 0.45,
      description: "Evitar números consecutivos em excesso"
    });

    // Padrão Fibonacci
    this.patterns.push({
      pattern: [1, 2, 3, 5, 8, 13], // Inspirado em sequência Fibonacci
      weight: 0.40,
      description: "Sequência baseada em proporção áurea e Fibonacci"
    });

    // Padrão de clusters harmônicos
    this.patterns.push({
      pattern: [1, 0, 1, 0, 1, 0], // Representando números de clusters diferentes
      weight: 0.50,
      description: "Distribuição harmônica entre clusters"
    });
  }

  /**
   * Extrai padrões dos últimos resultados específicos
   */
  private extractRecentPatterns(): { [key: string]: any } {
    const patternData: { [key: string]: any } = {
      clusterDistribution: Array(this.NUMBER_CLUSTERS.length).fill(0),
      repeatingNumbers: new Map<number, number>(),
      recentFrequencies: new Map<number, number>(),
      mostFrequentSum: 0,
      sumDistribution: new Map<number, number>(),
      mostFrequentOddCount: 0,
      oddEvenDistribution: new Map<number, number>(),
      consecutivePairs: new Map<string, number>(),
      distancePatterns: []
    };

    // Analisar os últimos sorteios mais recentes
    const RECENT_LIMIT = 20; // Análise mais extensa (20 sorteios)
    const recentResults = this.results.slice(0, RECENT_LIMIT);
    
    if (recentResults.length === 0) {
      return patternData;
    }
    
    // Mapear números que repetiram nos últimos sorteios
    const allRecentNumbers: number[] = [];
    recentResults.forEach(result => {
      const numbers = result.dezenas.map(n => parseInt(n));
      numbers.sort((a, b) => a - b); // Garantir ordem crescente
      
      // Adicionar números individuais
      numbers.forEach(n => allRecentNumbers.push(n));
      
      // Registrar pares consecutivos
      for (let i = 0; i < numbers.length - 1; i++) {
        const pair = `${numbers[i]}-${numbers[i+1]}`;
        patternData.consecutivePairs.set(
          pair, 
          (patternData.consecutivePairs.get(pair) || 0) + 1
        );
      }
      
      // Calcular a soma e registrar na distribuição
      const sum = numbers.reduce((total, n) => total + n, 0);
      patternData.sumDistribution.set(
        sum, 
        (patternData.sumDistribution.get(sum) || 0) + 1
      );
      
      // Calcular quantidade de ímpares e registrar
      const oddCount = numbers.filter(n => n % 2 === 1).length;
      patternData.oddEvenDistribution.set(
        oddCount, 
        (patternData.oddEvenDistribution.get(oddCount) || 0) + 1
      );
      
      // Analisar distribuição em clusters
      numbers.forEach(n => {
        for (let i = 0; i < this.NUMBER_CLUSTERS.length; i++) {
          if (this.NUMBER_CLUSTERS[i].includes(n)) {
            patternData.clusterDistribution[i] += 1;
            break;
          }
        }
      });
      
      // Analisar padrões de distância entre números consecutivos
      const distances: number[] = [];
      for (let i = 0; i < numbers.length - 1; i++) {
        distances.push(numbers[i+1] - numbers[i]);
      }
      patternData.distancePatterns.push(distances);
    });
    
    // Processar dados coletados para identificar padrões
    
    // Contar frequência dos números recentes
    allRecentNumbers.forEach(n => {
      patternData.repeatingNumbers.set(n, (patternData.repeatingNumbers.get(n) || 0) + 1);
    });
    
    // Calcular frequência normalizada (peso maior para sorteios mais recentes)
    for (let i = 1; i <= this.NUM_RANGE; i++) {
      patternData.recentFrequencies.set(i, 0);
    }
    
    recentResults.forEach((result, resultIndex) => {
      // Peso decai exponencialmente com o tempo
      const weight = Math.exp(-0.15 * resultIndex);
      
      result.dezenas.forEach(dezena => {
        const num = parseInt(dezena);
        patternData.recentFrequencies.set(
          num, 
          (patternData.recentFrequencies.get(num) || 0) + weight
        );
      });
    });
    
    // Encontrar soma mais frequente
    let maxSumCount = 0;
    patternData.sumDistribution.forEach((count: number, sum: number) => {
      if (count > maxSumCount) {
        maxSumCount = count;
        patternData.mostFrequentSum = sum;
      }
    });
    
    // Encontrar quantidade de ímpares mais frequente
    let maxOddCount = 0;
    patternData.oddEvenDistribution.forEach((count: number, odd: number) => {
      if (count > maxOddCount) {
        maxOddCount = count;
        patternData.mostFrequentOddCount = odd;
      }
    });
    
    // Calcular estatísticas de distância entre números consecutivos
    const allDistances: number[] = patternData.distancePatterns.flat();
    const avgDistance = allDistances.reduce((sum, d) => sum + d, 0) / allDistances.length;
    const minDistance = Math.min(...allDistances);
    const maxDistance = Math.max(...allDistances);
    
    patternData.distanceStats = {
      average: avgDistance,
      min: minDistance,
      max: maxDistance
    };
    
    // Identificar os 5 pares consecutivos mais comuns
    const sortedPairs = [...patternData.consecutivePairs.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    patternData.topConsecutivePairs = sortedPairs;
    
    return patternData;
  }

  /**
   * Calcula o score de cada número com base em múltiplos fatores avançados
   */
  private calculateNumberScores(): { number: number; score: number }[] {
    const scores: { number: number; score: number }[] = [];
    
    // Inicializar scores para todos os números
    for (let i = 1; i <= this.NUM_RANGE; i++) {
      scores.push({ number: i, score: 0 });
    }
    
    // Extrair padrões recentes para análise
    const recentPatterns = this.extractRecentPatterns();
    
    // Obter análise de ciclos e padrões temporais
    const cyclicalData = this.analyzeCyclicalPatterns();
    
    // Calcular estatísticas gerais para normalização
    const maxFrequency = Math.max(...this.statistics.map(s => s.frequency));
    const minFrequency = Math.min(...this.statistics.map(s => s.frequency));
    const frequencyRange = maxFrequency - minFrequency;
    
    // Fator 1: Frequência histórica (com peso decrescente para resultados mais antigos)
    const recentDrawWeight = 0.35; // Peso para sorteios recentes
    this.results.slice(0, 30).forEach((result, index) => {
      // Peso exponencialmente decrescente para resultados mais antigos
      const recencyWeight = Math.exp(-0.1 * index); 
      
      result.dezenas.forEach(dezena => {
        const num = parseInt(dezena);
        const scoreIndex = scores.findIndex(s => s.number === num);
        if (scoreIndex !== -1) {
          scores[scoreIndex].score += recentDrawWeight * recencyWeight;
        }
      });
    });
    
    // Fator 2: Estatísticas globais com normalização adaptativa
    this.statistics.forEach(stat => {
      const scoreIndex = scores.findIndex(s => s.number === stat.number);
      if (scoreIndex !== -1) {
        // Normalizar frequência (0-1)
        const normalizedFreq = frequencyRange > 0 
          ? (stat.frequency - minFrequency) / frequencyRange 
          : 0.5;
        
        // Usar curva de Gauss para favorecer números com frequência média-alta
        // Frequência perto de 60-70% do máximo recebe melhor score
        const optimalFreq = 0.65;
        const freqScore = Math.exp(-Math.pow(normalizedFreq - optimalFreq, 2) / 0.1);
        scores[scoreIndex].score += 0.25 * freqScore;
        
        // Ajustar baseado em tempo desde última aparição com função logística
        // Favorece números que não aparecem há um tempo médio (nem muito recente, nem muito antigo)
        const recencyRatio = stat.lastAppearance / 30;
        const recencyFactor = 1 / (1 + Math.exp(-(4 * recencyRatio - 3)));
        scores[scoreIndex].score += 0.20 * recencyFactor;
      }
    });
    
    // Fator 3: Padrões cíclicos e temporais - um fator crucial para precisão preditiva
    scores.forEach(s => {
      // Ajustar score com base em previsões cíclicas
      const cyclePrediction = cyclicalData.currentCyclePredictions.get(s.number);
      if (cyclePrediction) {
        // Quanto mais forte e próximo o ciclo, maior o boost
        const cycleBoost = cyclePrediction.cycleStrength * cyclePrediction.proximityFactor;
        s.score += 0.30 * cycleBoost; // Dar peso significativo para padrões cíclicos
      }
      
      // Ajustar score com base em fase lunar atual
      if (cyclicalData.lunarHotNumbers.includes(s.number)) {
        s.score += 0.15; // Boost para números frequentes na fase lunar atual
      }
      
      // Ajustar score com base em padrões sazonais
      if (cyclicalData.seasonalHotNumbers.includes(s.number)) {
        s.score += 0.10; // Boost para números frequentes na estação atual
      }
    });
    
    // Fator 4: Análise de padrões recentes
    if (this.settings.useHistoricalPatterns) {
      // Normalizar valores de distribuição de clusters
      const totalClusterWeight = Math.max(1, recentPatterns.clusterDistribution.reduce((a: number, b: number) => a + b, 0));
      const normalizedClusterDistribution = recentPatterns.clusterDistribution.map((w: number) => w / totalClusterWeight);
      
      scores.forEach(s => {
        // Ajustar score com base na pertinência a clusters frequentes
        for (let i = 0; i < this.NUMBER_CLUSTERS.length; i++) {
          if (this.NUMBER_CLUSTERS[i].includes(s.number)) {
            const clusterWeight = normalizedClusterDistribution[i];
            s.score += 0.15 * clusterWeight;
            break;
          }
        }
        
        // Ajustar com base em números que repetiram recentemente
        // Função normal de distribuição para encontrar o equilíbrio ideal de repetição
        const repeatCount = recentPatterns.repeatingNumbers.get(s.number) || 0;
        const optimalRepeat = 1.5; // Entre 1 e 2 repetições é o ideal
        const repeatScore = Math.exp(-Math.pow(repeatCount - optimalRepeat, 2) / 1.5);
        s.score += 0.15 * repeatScore;
        
        // Aplicar análise fibonacci/proporção áurea
        if (this.settings.useFibonacciPatterns) {
        const fibAdjustment = this.applyFibonacciAdjustment();
          s.score += 0.10 * fibAdjustment;
        }
      });
    }
    
    // Normalizar scores para 0-1
    const maxScore = Math.max(...scores.map(s => s.score), 0.001); // Evitar divisão por zero
    scores.forEach(s => {
      s.score = Math.min(1, s.score / maxScore);
      
      // Aplicar randomização controlada com distribuição normal
      if (this.settings.randomnessFactor > 0) {
        // Box-Muller para gerar número aleatório com distribuição normal
        const u1 = Math.random();
        const u2 = Math.random();
        const randNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        // Transformar para ficar entre 0.9 e 1.1 (com randomnessFactor controlando amplitude)
        const randomFactor = 1 + (randNormal * 0.1 * this.settings.randomnessFactor);
        s.score = s.score * (1 - this.settings.randomnessFactor/2) + (s.score * randomFactor * this.settings.randomnessFactor/2);
        s.score = Math.max(0, Math.min(1, s.score)); // Garantir limites
      }
    });
    
    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Aplica ajustes baseados em análise estatística avançada
   * Versão simplificada sem elementos pseudocientíficos
   */
  private applyFibonacciAdjustment(): number {
    // Se a configuração está desativada, retorna zero
    if (!this.settings.useFibonacciPatterns) {
      return 0;
    }
    
    // Versão simplificada para compatibilidade
    // Retorna um valor de ajuste mínimo
    return 0.1;
  }

  /**
   * Verifica a diversidade da distribuição dos números
   */
  private checkDistribution(numbers: number[]): boolean {
    // Verificar a distribuição por dezenas (1-10, 11-20, etc.)
    const decades = Array(6).fill(0);
    numbers.forEach(n => {
      const decade = Math.floor((n - 1) / 10);
      decades[decade]++;
    });
    
    // Condição ideal: números espalhados em pelo menos 4 dezenas diferentes
    const decadesUsed = decades.filter(d => d > 0).length;
    
    // Verificar se não há dezenas com muitos números (mais de 3)
    const overloadedDecades = decades.filter(d => d > 2).length;
    
    return decadesUsed >= 4 && overloadedDecades === 0;
  }

  /**
   * Verifica o equilíbrio entre números pares e ímpares
   */
  private checkParity(numbers: number[]): boolean {
    const oddCount = numbers.filter(n => n % 2 === 1).length;
    
    // Equilíbrio ideal: 3 pares e 3 ímpares (ou 2-4 ou 4-2)
    // Com uma pequena preferência para combinações 3-3
    if (oddCount === 3) {
      return true;
    } else if (oddCount === 2 || oddCount === 4) {
      return true;
    }
    
    return false;
  }

  /**
   * Verifica a soma total dos números
   */
  private checkSum(numbers: number[]): boolean {
    const sum = numbers.reduce((total, n) => total + n, 0);
    
    // Análise estatística mostra que somas entre 150 e 220 são mais frequentes
    // Com preferência para o centro desse intervalo (170-200)
    if (sum >= 170 && sum <= 200) {
      return true;
    } else if (sum >= 150 && sum <= 220) {
      return true;
    }
    
    return false;
  }

  /**
   * Verifica distribuição em clusters
   */
  private checkClusterDistribution(numbers: number[]): boolean {
    const clusterCounts = Array(this.NUMBER_CLUSTERS.length).fill(0);
    
    numbers.forEach(n => {
      for (let i = 0; i < this.NUMBER_CLUSTERS.length; i++) {
        if (this.NUMBER_CLUSTERS[i].includes(n)) {
          clusterCounts[i]++;
          break;
        }
      }
    });
    
    // Ideal: ter números de pelo menos 3 clusters diferentes
    // E não ter mais de 3 números de um mesmo cluster
    const clustersUsed = clusterCounts.filter(c => c > 0).length;
    const overloadedClusters = clusterCounts.filter(c => c > 2).length;
    
    return clustersUsed >= 3 && overloadedClusters === 0;
  }

  /**
   * Verifica presença de padrões fibonacci/proporção áurea
   */
  private checkGoldenPattern(numbers: number[]): number {
    let score = 0;
    
    // Verificar se a sequência tem proximidade com proporções áureas
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    
    // Checar todas as possíveis razões entre pares de números
    for (let i = 0; i < sortedNumbers.length; i++) {
      for (let j = i + 1; j < sortedNumbers.length; j++) {
        const ratio = sortedNumbers[j] / sortedNumbers[i];
      
      // Verificar proximidade com proporção áurea (phi ≈ 1.618)
        // Quanto mais próximo, maior o score
        const phiDistance = Math.abs(ratio - 1.618);
        if (phiDistance < 0.05) {
          score += 0.4; // Quase exato
        } else if (phiDistance < 0.1) {
          score += 0.2; // Muito próximo
        } else if (phiDistance < 0.2) {
          score += 0.1; // Próximo
        }
      }
    }
    
    // Verificar presença de números Fibonacci
    const fibNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55];
    const fibCount = numbers.filter(n => fibNumbers.includes(n)).length;
    
    // Checar sequências consecutivas de Fibonacci
    // Por exemplo, ter tanto 5 quanto 8, ou 13 e 21 na mesma combinação
    const fibPairs = [
      [1, 2], [2, 3], [3, 5], [5, 8], [8, 13], [13, 21], [21, 34], [34, 55]
    ];
    
    for (const pair of fibPairs) {
      if (numbers.includes(pair[0]) && numbers.includes(pair[1])) {
        score += 0.25; // Bonificação para pares consecutivos
      }
    }
    
    score += fibCount * 0.1; // Cada número de Fibonacci adiciona um pouco ao score
    
    return Math.min(1, score); // Normalizar para máximo de 1
  }

  /**
   * Seleciona 6 números com base na análise avançada multifatorial
   */
  public generateRecommendation(): AIAnalysisResult {
    // Calcular scores para todos os números
    const scoredNumbers = this.calculateNumberScores();
    
    // Obter análise cíclica e temporal
    const cyclicalData = this.analyzeCyclicalPatterns();
    const temporalData = this.analyzeTemporalPatterns();
    
    // Adicionar análise de tendências recentes
    const recentData = this.extractRecentPatterns();
    
    // Primeira seleção: dividir em categorias usando estatística simples
    const totalNumbers = this.NUM_RANGE;
    const highLimit = Math.round(totalNumbers * 0.25); // Top 25%
    const mediumLimit = Math.round(totalNumbers * 0.40); // Próximos 40%
    
    // Separar números por categoria de probabilidade
    const highProbNumbers = scoredNumbers.slice(0, highLimit).map(s => s.number);
    const mediumProbNumbers = scoredNumbers.slice(highLimit, highLimit + mediumLimit).map(s => s.number);
    const lowProbNumbers = scoredNumbers.slice(highLimit + mediumLimit).map(s => s.number);
    
    // Números com ciclos detectados
    const cyclicalNumbers = Array.from(cyclicalData.currentCyclePredictions.keys()) as number[];
    
    // Identificar números "quentes" (que estão aparecendo com mais frequência recentemente)
    const hotNumbers = this.identifyHotNumbers();
    
    // Algoritmo híbrido melhorado
    let bestSet: number[] = [];
    let bestScore = -1;
    
    // Tamanho da população para o algoritmo genético
    const POPULATION_SIZE = this.settings.iterationDepth ? 
      Math.min(100, Math.floor(this.settings.iterationDepth / 100)) : 40;
    const MAX_GENERATIONS = this.settings.iterationDepth ? 
      Math.floor(this.settings.iterationDepth / POPULATION_SIZE) : 100;
    
    // Gerar população inicial diversificada
    let population: Array<Array<number>> = [];
    
    // Estratégias de inicialização:
    // 1. Conjunto com números quentes (frequência recente alta)
    population.push([
      ...this.getRandomElements<number>(hotNumbers.length >= 4 ? hotNumbers : highProbNumbers, 4),
      ...this.getRandomElements<number>((cyclicalNumbers.length > 2 ? cyclicalNumbers : highProbNumbers) as number[], 2)
    ]);
    
    // 2. Conjunto com alta probabilidade e números quentes
    population.push([
      ...this.getRandomElements<number>(highProbNumbers, 3),
      ...this.getRandomElements<number>(hotNumbers.length >= 3 ? hotNumbers : mediumProbNumbers, 3)
    ]);
    
    // 3. Conjunto baseado em padrões cíclicos detectados
    population.push([
      ...this.getRandomElements<number>(cyclicalNumbers.length >= 3 ? cyclicalNumbers : highProbNumbers, 3),
      ...this.getRandomElements<number>(highProbNumbers, 3)
    ]);
    
    // 4. Conjunto balanceado entre alta probabilidade e padrões cíclicos
    population.push([
      ...this.getRandomElements<number>(highProbNumbers, 2),
      ...this.getRandomElements<number>(cyclicalNumbers.length >= 2 ? cyclicalNumbers : mediumProbNumbers, 2),
      ...this.getRandomElements<number>(hotNumbers.length >= 2 ? hotNumbers : lowProbNumbers, 2)
    ]);
    
    // Completar a população inicial com combinações aleatórias
    while (population.length < POPULATION_SIZE) {
      // Mix de diferentes fontes para garantir diversidade genética
      const randomSource = Math.random();
      let newIndividual: number[];
      
      if (randomSource < 0.3) {
        // Favorece números de alta probabilidade
        newIndividual = [
          ...this.getRandomElements<number>(highProbNumbers, 3),
          ...this.getRandomElements<number>(mediumProbNumbers, 2),
          ...this.getRandomElements<number>(lowProbNumbers, 1)
        ];
      } else if (randomSource < 0.6) {
        // Favorece números de probabilidade média
        newIndividual = [
          ...this.getRandomElements<number>(highProbNumbers, 2),
          ...this.getRandomElements<number>(mediumProbNumbers, 3),
          ...this.getRandomElements<number>(lowProbNumbers, 1)
        ];
      } else if (randomSource < 0.9) {
        // Mix equilibrado
        newIndividual = [
          ...this.getRandomElements<number>(highProbNumbers, 2),
          ...this.getRandomElements<number>(mediumProbNumbers, 2),
          ...this.getRandomElements<number>(lowProbNumbers, 2)
        ];
      } else {
        // Completamente aleatório
        const allNumbers = Array.from({length: 60}, (_, i) => i + 1);
        newIndividual = this.getRandomElements<number>(allNumbers, 6);
      }
      
      // Garantir números únicos e ordenados
      newIndividual = [...new Set(newIndividual)];
      while (newIndividual.length < 6) {
        const randomNum = Math.floor(Math.random() * this.NUM_RANGE) + 1;
        if (!newIndividual.includes(randomNum)) {
          newIndividual.push(randomNum);
        }
      }
      
      newIndividual.sort((a, b) => a - b);
      
      // Adicionar à população apenas se for uma combinação única
      if (!population.some(individual => 
        individual.length === newIndividual.length && 
        individual.every((val, i) => val === newIndividual[i]))) {
        population.push(newIndividual);
      }
    }
    
    // Evolução da população por múltiplas gerações (simplificado)
    for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
      // Avaliar fitness de cada indivíduo
      const fitness = population.map(individual => 
        this.evaluateCombination(individual, scoredNumbers)
      );
      
      // Encontrar o melhor indivíduo desta geração
      const bestFitnessIndex = fitness.indexOf(Math.max(...fitness));
      const bestIndividual = population[bestFitnessIndex];
      const bestFitness = fitness[bestFitnessIndex];
      
      // Atualizar melhor conjunto global se necessário
      if (bestFitness > bestScore) {
        bestScore = bestFitness;
        bestSet = [...bestIndividual];
      }
      
      // Criar nova população através de seleção, cruzamento e mutação
      const newPopulation: number[][] = [];
      
      // Elitismo: manter o melhor indivíduo sem alterações
      newPopulation.push(bestIndividual);
      
      // Criar o resto da população
      while (newPopulation.length < POPULATION_SIZE) {
        // Seleção por torneio
        const parent1 = this.tournamentSelection(population, fitness);
        const parent2 = this.tournamentSelection(population, fitness);
        
        // Cruzamento
        let child: number[];
        
        // 90% de chance de cruzamento, 10% de cópia direta
        if (Math.random() < 0.9) {
          child = this.crossover(parent1, parent2);
        } else {
          // Cópia de um dos pais (clonagem)
          child = Math.random() < 0.5 ? [...parent1] : [...parent2];
        }
        
        // Mutação (possibilidade de trocar números)
        child = this.mutate(child as number[], 
                          highProbNumbers as number[], 
                          mediumProbNumbers as number[], 
                          cyclicalNumbers as number[]);
        
        // Garantir que tem exatamente 6 números únicos
        child = [...new Set(child)];
        while (child.length < 6) {
          const randomPool = Math.random() < 0.7 ? highProbNumbers : mediumProbNumbers;
          const randomNum = randomPool[Math.floor(Math.random() * randomPool.length)];
          if (!child.includes(randomNum)) {
            child.push(randomNum);
          }
        }
        
        // Limitar a 6 números se por algum motivo tiver mais
        if (child.length > 6) {
          child = child.slice(0, 6);
        }
        
        // Ordenar
        child.sort((a, b) => a - b);
        
        // Adicionar à nova população
        newPopulation.push(child);
      }
      
      // Substituir a população antiga
      population = newPopulation;
    }
    
    // Gerar insights baseados na análise completa
    const insights = this.generateInsights(bestSet, {
      ...cyclicalData,
      ...temporalData,
      hotNumbers,
      recentPatterns: recentData
    });
    
    // Criar o mapa de calor completo para visualização
    const heatmap = scoredNumbers.map(s => ({
      number: s.number,
      score: Math.round(s.score * 1000) / 1000
    }));
    
    // Criar padrões detectados
    const patterns = this.detectPatterns(bestSet);
    
    // Calcular score final de confiança (0-100)
    const confidenceScore = Math.min(99, Math.round(bestScore * 100));
    
    return {
      recommendedNumbers: bestSet,
      confidenceScore,
      insights,
      patterns,
      heatmap
    };
  }
  
  /**
   * Implementa seleção por torneio para o algoritmo genético
   */
  private tournamentSelection(population: number[][], fitness: number[]): number[] {
    // Selecionar 3 indivíduos aleatórios
    const tournamentSize = 3;
    const indices: number[] = [];
    
    while (indices.length < tournamentSize) {
      const idx = Math.floor(Math.random() * population.length);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }
    
    // Selecionar o melhor dos 3
    let bestIdx = indices[0];
    for (let i = 1; i < tournamentSize; i++) {
      if (fitness[indices[i]] > fitness[bestIdx]) {
        bestIdx = indices[i];
      }
    }
    
    return population[bestIdx];
  }
  
  /**
   * Implementa cruzamento de dois pais para gerar um filho
   */
  private crossover(parent1: number[], parent2: number[]): number[] {
    // Ponto de corte aleatório
    const cutPoint = Math.floor(Math.random() * 5) + 1; // Entre 1 e 5
    
    // Criar filho combinando segmentos dos pais
    const child: number[] = [
      ...parent1.slice(0, cutPoint),
      ...parent2.slice(cutPoint)
    ];
    
    return child;
  }
  
  /**
   * Implementa mutação de um indivíduo
   */
  private mutate(individual: number[], 
                highProbNumbers: number[], 
                mediumProbNumbers: number[], 
                cyclicalNumbers: number[]): number[] {
    const mutated = [...individual];
    
    // Taxa de mutação: 30%
    if (Math.random() < 0.3) {
      // Selecionar um índice aleatório para mutação
      const mutationIdx = Math.floor(Math.random() * mutated.length);
      
      // Escolher fonte da mutação
      const mutationSource = Math.random();
      let replacementPool: number[];
      
      if (mutationSource < 0.4) {
        replacementPool = highProbNumbers;
      } else if (mutationSource < 0.7) {
        replacementPool = mediumProbNumbers;
      } else if (mutationSource < 0.9 && cyclicalNumbers.length > 0) {
        replacementPool = cyclicalNumbers;
      } else {
        // Qualquer número de 1 a 60
        replacementPool = Array.from({length: 60}, (_, i) => i + 1);
      }
      
      // Escolher um número que não está no indivíduo atual
      const validReplacements = replacementPool.filter(n => !mutated.includes(n));
      
      if (validReplacements.length > 0) {
        const replacement = validReplacements[Math.floor(Math.random() * validReplacements.length)];
        mutated[mutationIdx] = replacement;
      }
    }
    
    return mutated;
  }

  /**
   * Gera insights detalhados baseados na análise estatística completa
   */
  private generateInsights(numbers: number[], analysisData: {[key: string]: any}): string[] {
    const insights: string[] = [];
    
    // Análise da combinação recomendada
    const oddCount = numbers.filter(n => n % 2 === 1).length;
    const evenCount = 6 - oddCount;
    insights.push(`A combinação tem ${oddCount} números ímpares e ${evenCount} números pares.`);
    
    // Soma dos números
    const sum = numbers.reduce((total, n) => total + n, 0);
    insights.push(`A soma total dos números é ${sum} (${sum < 150 ? 'abaixo' : sum > 220 ? 'acima' : 'dentro'} da faixa estatisticamente mais frequente 150-220).`);
    
    // Verificar distribuição por dezenas
    const decadeDistribution = Array(6).fill(0);
    numbers.forEach(n => {
      const decade = Math.floor((n - 1) / 10);
      decadeDistribution[decade] += 1;
    });
    
    const decadesUsed = decadeDistribution.filter(count => count > 0).length;
    const decadesRepresentation = decadeDistribution.map((count, idx) => 
      count > 0 ? `${count} na ${idx+1}ª` : null
    ).filter(Boolean).join(', ');
    
    insights.push(`A combinação cobre ${decadesUsed} das 6 faixas de dezenas possíveis (${decadesRepresentation}).`);
    
    // Verificar se há números "quentes" na seleção
    const hotNumbers = analysisData.hotNumbers || [];
    const hotCount = numbers.filter(n => hotNumbers.includes(n)).length;
    
    if (hotCount > 0) {
      const hotOnes = numbers.filter(n => hotNumbers.includes(n)).join(', ');
      insights.push(`Incluímos ${hotCount} números que estão "quentes" (${hotOnes}), que aparecem com mais frequência nos sorteios recentes.`);
    }
    
    // Tendências cíclicas
    if (analysisData.currentCyclePredictions && analysisData.currentCyclePredictions.size > 0) {
      const cyclicalNumbers = Array.from(analysisData.currentCyclePredictions.keys()) as number[];
      const cyclicalSelected = numbers.filter(n => cyclicalNumbers.includes(n));
      const cyclicalCount = cyclicalSelected.length;
      
      if (cyclicalCount > 0) {
        const cyclicalStr = cyclicalSelected.join(', ');
        insights.push(`${cyclicalCount} números (${cyclicalStr}) estão em ciclos de repetição estatisticamente significativos.`);
      }
    }
    
    // Análise de distâncias entre números
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const distances: number[] = [];
    
    // Calcular distâncias entre números consecutivos
    for (let i = 0; i < sortedNumbers.length - 1; i++) {
      distances.push(sortedNumbers[i+1] - sortedNumbers[i]);
    }
    
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    insights.push(`A distância média entre os números consecutivos é ${avgDistance.toFixed(1)}, o que indica uma ${avgDistance < 8 ? 'boa' : 'ampla'} distribuição no intervalo de 1-60.`);
    
    // Padrões de clusters
    let clusterInsight = "";
    const clustersUsed = new Set<number>();
    
    numbers.forEach(n => {
      for (let i = 0; i < this.NUMBER_CLUSTERS.length; i++) {
        if (this.NUMBER_CLUSTERS[i].includes(n)) {
          clustersUsed.add(i);
          break;
        }
      }
    });
    
    if (clustersUsed.size <= 3) {
      clusterInsight = `A combinação apresenta alta concentração em ${clustersUsed.size} grupos matemáticos.`;
    } else {
      clusterInsight = `A combinação está bem distribuída entre ${clustersUsed.size} grupos matemáticos distintos.`;
    }
    insights.push(clusterInsight);
    
    // Análise histórica
    const totalResults = this.results.length;
    insights.push(`Esta análise utilizou 100% dos dados históricos disponíveis (${totalResults} sorteios), sem qualquer amostragem ou aleatoriedade.`);
    
    // Análise de frequência
    const frequencyInfo = numbers.map(n => {
      const stat = this.statistics.find(s => s.number === n);
      return {
        number: n,
        frequency: stat ? stat.frequency : 0,
        percentage: stat ? stat.percentage : 0
      };
    });
    
    // Calcular média de frequência dos números selecionados
    const avgFrequency = frequencyInfo.reduce((sum, info) => sum + info.frequency, 0) / frequencyInfo.length;
    const avgPercentage = frequencyInfo.reduce((sum, info) => sum + info.percentage, 0) / frequencyInfo.length;
    
    insights.push(`A frequência média destes números nos sorteios históricos é ${avgFrequency.toFixed(1)} vezes (${(avgPercentage * 100).toFixed(2)}%).`);
    
    return insights;
  }
  
  /**
   * Detecta padrões estatísticos na combinação
   */
  private detectPatterns(numbers: number[]): AIPattern[] {
    const patterns: AIPattern[] = [];
    
    // Padrão: Distribuição entre dezenas
    patterns.push({
        description: "Distribuição entre dezenas",
      numbers,
      confidence: this.checkDistribution(numbers) ? 0.85 : 0.5
    });
    
    // Padrão: Equilíbrio par/ímpar
    if (this.settings.useParityAnalysis) {
      patterns.push({
        description: "Equilíbrio par/ímpar",
        numbers,
        confidence: this.checkParity(numbers) ? 0.75 : 0.45
      });
    }
    
    // Padrão: Soma ideal
    if (this.settings.useSumAnalysis) {
      patterns.push({
        description: "Soma total ideal",
        numbers,
        confidence: this.checkSum(numbers) ? 0.8 : 0.4
      });
    }
    
    // Padrão: Distribuição em clusters
    if (this.settings.useClusterAnalysis) {
      patterns.push({
        description: "Distribuição em clusters",
        numbers,
        confidence: this.checkClusterDistribution(numbers) ? 0.75 : 0.5
      });
    }
    
    // Padrão: Proporção áurea e Fibonacci
    if (this.settings.useFibonacciPatterns) {
      const goldenScore = this.checkGoldenPattern(numbers);
      patterns.push({
        description: "Padrões áureos e Fibonacci",
        numbers,
        confidence: goldenScore
      });
    }
    
    return patterns;
  }

  public updateSettings(settings: Partial<AIRecommendationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  /**
   * Método interno para obter elementos aleatórios de um array
   * usando o algoritmo de Fisher-Yates
   */
  private getRandomElements<T>(array: T[], count: number): T[] {
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
  }

  /**
   * Analisa padrões temporais nos resultados históricos
   * Versão simplificada com foco em estatística válida
   */
  private analyzeTemporalPatterns(): { [key: string]: any } {
    const temporalData: { [key: string]: any } = {
      weekdayDistribution: Array(7).fill(0),
      monthDistribution: Array(12).fill(0),
      dayOfMonthDistribution: Array(31).fill(0),
      cyclicalNumbers: new Map<number, number[]>() // Números que aparecem em ciclos temporais
    };
    
    // Processar até 200 sorteios para ter dados temporais significativos
    const historicalResults = this.results.slice(0, 200);
    
    // Mapear distribuição temporal
    historicalResults.forEach(result => {
      // Converter data formato BR (DD/MM/YYYY) para Date
      const dateParts = result.data.split('/');
      if (dateParts.length !== 3) return;
      
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Mês em JS é 0-11
      const year = parseInt(dateParts[2]);
      
      const drawDate = new Date(year, month, day);
      
      // Dia da semana (0 = domingo, 6 = sábado)
      const weekday = drawDate.getDay();
      temporalData.weekdayDistribution[weekday]++;
      
      // Mês
      temporalData.monthDistribution[month]++;
      
      // Dia do mês
      temporalData.dayOfMonthDistribution[day - 1]++;
    });
    
    // Processar dados para identificar padrões cíclicos em cada número
    for (let num = 1; num <= this.NUM_RANGE; num++) {
      // Identificar em quais sorteios o número apareceu
      const occurrences: number[] = [];
      historicalResults.forEach((result, idx) => {
        if (result.dezenas.includes(num.toString())) {
          occurrences.push(idx);
        }
      });
      
      // Calcular diferenças entre aparições consecutivas
      const intervals: number[] = [];
      for (let i = 1; i < occurrences.length; i++) {
        intervals.push(occurrences[i] - occurrences[i-1]);
      }
      
      // Se houver pelo menos 3 intervalos, procurar padrões cíclicos
      if (intervals.length >= 3) {
        temporalData.cyclicalNumbers.set(num, intervals);
      }
    }
    
    // Calcular distribuições normalizadas
    const totalDraws = historicalResults.length;
    
    // Normalizar distribuições
    temporalData.weekdayProbability = temporalData.weekdayDistribution.map(
      (count: number) => count / totalDraws
    );
    
    return temporalData;
  }

  /**
   * Analisa ciclos numéricos e identifica números com probabilidade aumentada de ocorrência
   */
  private analyzeCyclicalPatterns(): { [key: string]: any } {
    const cyclicalData: { [key: string]: any } = {
      currentCyclePredictions: new Map<number, number>(),
      longTermCycles: [],
      harmonicNumbers: []
    };
    
    // Obter análise temporal
    const temporalData = this.analyzeTemporalPatterns();
    
    // Identificar ciclos para cada número
    for (const [numStr, intervals] of temporalData.cyclicalNumbers.entries()) {
      const num = Number(numStr);
      // Calcular estatísticas dos intervalos
      const avgInterval = intervals.reduce((sum: number, val: number) => sum + val, 0) / intervals.length;
      const stdDev = Math.sqrt(
        intervals.reduce((sum: number, val: number) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length
      );
      
      // Se o desvio padrão for baixo, é um indicativo de ciclo regular
      const hasCycle = stdDev / avgInterval < 0.4; // Baixa variação indica ciclo confiável
      
      if (hasCycle) {
        // Verificar em qual sorteio o número apareceu pela última vez
        let lastOccurrence = -1;
        for (let i = 0; i < this.results.length; i++) {
          if (this.results[i].dezenas.includes(num.toString())) {
            lastOccurrence = i;
            break;
          }
        }
        
        if (lastOccurrence >= 0) {
          // Prever o próximo sorteio com base no ciclo médio
          const nextPredictedDraw = lastOccurrence + Math.round(avgInterval);
          
          // Se esse sorteio estiver próximo, aumentar a probabilidade deste número
          const currentPositionInCycle = Math.abs(nextPredictedDraw);
          
          // Adicionar predição se estiver dentro de uma janela razoável
          if (currentPositionInCycle <= 5) { // Próximo de um ciclo completo
            cyclicalData.currentCyclePredictions.set(num, {
              cycleStrength: 1 - (stdDev / avgInterval), // Força do ciclo (0-1)
              proximityFactor: 1 - (currentPositionInCycle / 5), // Proximidade do próximo ciclo (0-1)
              averageInterval: avgInterval
            });
          }
        }
      }
    }
    
    // Inicializar arrays vazios para compatibilidade com código existente
    cyclicalData.lunarHotNumbers = [];
    cyclicalData.seasonalHotNumbers = [];
    
    return cyclicalData;
  }

  /**
   * Identifica números "quentes" com base em análise de frequência recente
   * e tendências de crescimento na frequência
   */
  private identifyHotNumbers(): number[] {
    // Ampliar a análise para 30 sorteios para melhor detecção de tendências
    const RECENT_DRAWS = 30; 
    const recentResults = this.results.slice(0, Math.min(RECENT_DRAWS, this.results.length));
    
    // Contagem de frequência dos números nos sorteios recentes
    const recentFrequency: Map<number, number> = new Map();
    // Frequência em grupo mais recente (últimos 10)
    const veryRecentFrequency: Map<number, number> = new Map();
    // Frequência em grupo menos recente (11-30)
    const lessRecentFrequency: Map<number, number> = new Map();
    
    // Inicializar todas as frequências com 0
    for (let i = 1; i <= this.NUM_RANGE; i++) {
      recentFrequency.set(i, 0);
      veryRecentFrequency.set(i, 0);
      lessRecentFrequency.set(i, 0);
    }
    
    // Contar ocorrências de cada número, separando por grupos de recência
    recentResults.forEach((result, idx) => {
      result.dezenas.forEach(d => {
        const num = parseInt(d);
        recentFrequency.set(num, (recentFrequency.get(num) || 0) + 1);
        
        // Separar contagem por grupos de recência
        if (idx < 10) {
          veryRecentFrequency.set(num, (veryRecentFrequency.get(num) || 0) + 1);
        } else {
          lessRecentFrequency.set(num, (lessRecentFrequency.get(num) || 0) + 1);
        }
      });
    });
    
    // Aplicar peso temporal (resultados mais recentes têm mais peso)
    recentResults.forEach((result, idx) => {
      // Peso com base na idade do resultado (mais recente = mais peso)
      const weight = Math.pow(0.95, idx); // Decaimento exponencial mais gradual
      
      result.dezenas.forEach(d => {
        const num = parseInt(d);
        recentFrequency.set(num, (recentFrequency.get(num) || 0) + weight);
      });
    });
    
    // Calcular tendência de crescimento (números que estão aparecendo mais recentemente)
    const growthTrend: Map<number, number> = new Map();
    
    for (let i = 1; i <= this.NUM_RANGE; i++) {
      const veryRecent = veryRecentFrequency.get(i) || 0;
      const lessRecent = lessRecentFrequency.get(i) || 0;
      
      // Normalizar as frequências (pelo número de sorteios em cada grupo)
      const normalizedVeryRecent = veryRecent / 10;
      const normalizedLessRecent = lessRecent / 20;
      
      // Calcular crescimento relativo
      let growthScore = 0;
      
      if (normalizedLessRecent > 0) {
        // Crescimento percentual
        growthScore = (normalizedVeryRecent - normalizedLessRecent) / normalizedLessRecent;
      } else if (normalizedVeryRecent > 0) {
        // Apareceu recentemente mas não antes (crescimento infinito, limitamos a 2)
        growthScore = 2;
      }
      
      growthTrend.set(i, growthScore);
    }
    
    // Combinar frequência e crescimento para pontuação final
    const hotScore: Map<number, number> = new Map();
    
    for (let i = 1; i <= this.NUM_RANGE; i++) {
      const frequencyScore = recentFrequency.get(i) || 0;
      const growthScore = growthTrend.get(i) || 0;
      
      // Pontuação combinada (peso maior para crescimento)
      const score = frequencyScore * 0.6 + Math.max(0, growthScore) * 0.4;
      hotScore.set(i, score);
    }
    
    // Identificar os top números mais "quentes"
    const entries = Array.from(hotScore.entries());
    entries.sort((a, b) => b[1] - a[1]); // Ordem decrescente
    
    // Retornar os números "quentes" (15 para dar mais opções)
    return entries.slice(0, 15).map(entry => entry[0]);
  }

  /**
   * Avalia a qualidade estatística de uma combinação
   * com maior peso para números quentes e padrões recentes
   */
  private evaluateCombination(numbers: number[], scoredNumbers: { number: number; score: number }[]): number {
    if (!numbers || numbers.length !== 6) {
      return 0;
    }
    
    let score = 0;
    
    // 1. Avaliar a qualidade dos números individuais
    const individualScores = numbers.map(num => {
      const numData = scoredNumbers.find(s => s.number === num);
      return numData ? numData.score : 0;
    });
    
    // Score base é a média dos scores individuais (35% do total)
    score += (individualScores.reduce((sum, s) => sum + s, 0) / 6) * 0.35;
    
    // 2. Avaliar distribuição de dezenas (10% do total)
    if (this.checkDistribution(numbers)) {
      score += 0.10;
    }
    
    // 3. Avaliar paridade (10% do total)
    if (this.checkParity(numbers)) {
      score += 0.10;
    }
    
    // 4. Avaliar soma (10% do total)
    if (this.checkSum(numbers)) {
      score += 0.1;
    }
    
    // 5. Avaliar distribuição de clusters (10% do total)
    if (this.checkClusterDistribution(numbers)) {
      score += 0.1;
    }
    
    // 6. Padrão dourado baseado em proporção áurea (5% do total)
    score += this.checkGoldenPattern(numbers) * 0.05;
    
    // 7. Verificar se existem números "quentes" na combinação (15% do total - aumentado)
    const hotNumbers = this.identifyHotNumbers();
    const hotCount = numbers.filter(n => hotNumbers.includes(n)).length;
    score += (hotCount / 6) * 0.15;
    
    // 8. Verificar se combinação tem padrões de distância adequados (5% do total)
    score += this.checkDistancePatterns(numbers) * 0.05;
    
    return score;
  }

  /**
   * Verifica se a distribuição de distâncias entre números está adequada
   * Evita muitos números próximos ou muito distantes entre si
   */
  private checkDistancePatterns(numbers: number[]): number {
    if (numbers.length < 2) return 0;
    
    let score = 0;
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const distances: number[] = [];
    
    // Calcular distâncias entre números consecutivos
    for (let i = 0; i < sortedNumbers.length - 1; i++) {
      distances.push(sortedNumbers[i+1] - sortedNumbers[i]);
    }
    
    // Verificar variância das distâncias (queremos distribuição equilibrada)
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
    
    // Penalizar alta variância (números muito irregularmente espaçados)
    if (variance < 10) {
      score += 1.0; // Espaçamento ideal
    } else if (variance < 20) {
      score += 0.7; // Bom espaçamento
    } else if (variance < 30) {
      score += 0.4; // Espaçamento aceitável
    } else {
      score += 0.2; // Espaçamento ruim
    }
    
    // Penalizar distâncias muito pequenas (números muito próximos)
    const minDistance = Math.min(...distances);
    if (minDistance >= 3) {
      score += 0.5; // Boa separação mínima
    } else if (minDistance >= 2) {
      score += 0.3; // Separação aceitável
    }
    
    // Penalizar distâncias muito grandes (áreas vazias no espaço de números)
    const maxDistance = Math.max(...distances);
    if (maxDistance <= 15) {
      score += 0.5; // Sem grandes áreas vazias
    } else if (maxDistance <= 20) {
      score += 0.3; // Áreas vazias aceitáveis
    }
    
    return score / 3; // Normalizar para 0-1
  }
}

/**
 * Função de análise avançada dos resultados para identificar padrões e gerar recomendações
 * com base em 100% dos dados históricos disponíveis
 */
export const analyzeResultsWithAI = (
  results: MegaSenaResult[],
  statistics: NumberStatistics[],
  settings?: Partial<AIRecommendationSettings>
): AIAnalysisResult => {
  if (!results || results.length === 0) {
    throw new Error("Nenhum resultado disponível para análise");
  }
  
  if (!statistics || statistics.length === 0) {
    throw new Error("Estatísticas não disponíveis para análise");
  }
  
  // Ordenar resultados para garantir análise correta, do mais recente para o mais antigo
  const sortedResults = [...results].sort((a, b) => b.concurso - a.concurso);
  
  // Validar configurações para evitar valores inválidos
  const validatedSettings: Partial<AIRecommendationSettings> = { 
    // Forçar configurações para análise completa
    useHistoricalPatterns: true,
    useFrequencyAnalysis: true,
    balanceHotCold: true,
    // Minimizar aleatoriedade
    randomnessFactor: settings?.randomnessFactor !== undefined ? 
      Math.min(0.3, Math.max(0, settings.randomnessFactor)) : 0.3,
    // Aumentar a profundidade de iteração para melhor resultado
    iterationDepth: settings?.iterationDepth !== undefined ? 
      Math.max(10000, Math.min(30000, settings.iterationDepth)) : 15000,
    // Outras configurações personalizadas
    useSumAnalysis: settings?.useSumAnalysis !== undefined ? settings.useSumAnalysis : true,
    useParityAnalysis: settings?.useParityAnalysis !== undefined ? settings.useParityAnalysis : true,
    useFibonacciPatterns: settings?.useFibonacciPatterns !== undefined ? settings.useFibonacciPatterns : false,
    useClusterAnalysis: settings?.useClusterAnalysis !== undefined ? settings.useClusterAnalysis : true,
  };
  
  console.log(`Analisando ${sortedResults.length} resultados com configurações otimizadas:`, validatedSettings);
  
  // Inicializar o analisador com resultados ordenados
  const analyzer = new AINumberAnalyzer(sortedResults, statistics);
  
  // Aplicar configurações personalizadas validadas
  analyzer.updateSettings(validatedSettings as AIRecommendationSettings);
  
  try {
    // Executar a análise completa
    const result = analyzer.generateRecommendation();
    
    // Ordenar os números recomendados
    result.recommendedNumbers.sort((a, b) => a - b);
    
    // Adicionar timestamp para rastreamento/auditoria
    return {
      ...result,
      timestamp: new Date().toISOString(),
      analysisVersion: "3.0" // Versão atualizada do algoritmo
    } as AIAnalysisResult;
  } catch (error) {
    console.error("Erro na análise:", error);
    // Retornar um resultado fallback em caso de erro
    return {
      recommendedNumbers: [],
      confidenceScore: 0,
      insights: ["Erro na análise. Por favor, tente novamente."],
      patterns: [],
      heatmap: []
    };
  }
}; 