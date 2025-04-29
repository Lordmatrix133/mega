export interface MegaSenaResult {
  concurso: number;
  data: string;
  dezenas: string[];
  dezenasOrdemSorteio?: string[];
  local?: string;
  premiacoes: Premiacao[];
  acumulou: boolean;
  valorAcumulado: string;
  dataProximoConcurso: string;
  valorEstimadoProximoConcurso: string;
  trevos?: string[];
  timeCoracao?: string | null;
  mesSorte?: string | null;
  localGanhadores?: LocalGanhador[];
  estadosPremiados?: string[];
}

export interface LocalGanhador {
  ganhadores: number;
  municipio: string;
  uf: string;
  posicao?: number;
  nomeFantasiaUL?: string;
  serie?: string;
}

export interface Premiacao {
  descricao?: string;
  faixa?: number;
  acertos?: string;
  ganhadores: number;
  valorPremio?: number;
  premio?: string;
}

export interface NumberStatistics {
  number: number;
  frequency: number;
  percentage: number;
  lastAppearance: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface RecommendationSet {
  numbers: number[];
  confidence: number;
  reasoning: string;
}

export interface DrawFrequency {
  number: number;
  frequency: number;
}

// IA Analyzer interfaces
export interface AIPattern {
  description: string;
  numbers: number[];
  confidence: number;
}

export interface AINumberScore {
  number: number;
  score: number;
}

export interface AIAnalysisResult {
  recommendedNumbers: number[];
  confidenceScore: number;
  insights: string[];
  patterns: AIPattern[];
  heatmap: AINumberScore[];
  timestamp?: string;
  analysisVersion?: string;
}

export interface AIRecommendationSettings {
  useHistoricalPatterns: boolean;
  useFrequencyAnalysis: boolean;
  useSumAnalysis: boolean;
  useParityAnalysis: boolean;
  balanceHotCold: boolean;
  randomnessFactor: number;
  useFibonacciPatterns?: boolean;
  useClusterAnalysis?: boolean;
  iterationDepth?: number;
}