import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { analyzeResultsWithAI } from '../utils/aiAnalyzer';
import { AIAnalysisResult, AIRecommendationSettings } from '../types';
import { Brain, RefreshCw, Settings, Info } from 'lucide-react';

const AIRecommendationPanel: React.FC = () => {
  const { filteredResults, numberStatistics, loading } = useData();
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const analysisGeneratedRef = useRef<boolean>(false);
  const [settings, setSettings] = useState<AIRecommendationSettings>({
    useHistoricalPatterns: true,
    useFrequencyAnalysis: true,
    useSumAnalysis: true,
    useParityAnalysis: true,
    balanceHotCold: true,
    randomnessFactor: 0.35,
    useFibonacciPatterns: true,
    useClusterAnalysis: true,
    iterationDepth: 10000
  });

  // Gerar análise quando os dados forem carregados pela primeira vez nesta sessão
  useEffect(() => {
    if (!loading && 
        filteredResults.length > 0 && 
        numberStatistics.length > 0 && 
        !aiResult && 
        !processing && 
        !analysisGeneratedRef.current) {
      generateAnalysis();
      analysisGeneratedRef.current = true;
    }
  }, [filteredResults, numberStatistics, loading]);

  // Função para calcular há quantos sorteios um número apareceu pela última vez
  const getLastAppearance = (number: number) => {
    if (!filteredResults || filteredResults.length === 0) return 'N/A';
    
    // Verificar cada sorteio, do mais recente para o mais antigo
    for (let i = 0; i < filteredResults.length; i++) {
      const dezenas = filteredResults[i].dezenas;
      
      // Verificar se o número está presente neste sorteio em qualquer formato
      if (dezenas.some(d => parseInt(d) === number)) {
        return i === 0 ? 'Último sorteio' : `${i} sorteios atrás`;
      }
    }
    
    return 'Não encontrado';
  };

  const generateAnalysis = async () => {
    if (loading || processing || filteredResults.length === 0 || numberStatistics.length === 0) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Pequeno timeout para permitir que a UI mostre o estado de processamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = analyzeResultsWithAI(filteredResults, numberStatistics, settings);
      setAiResult(result);
    } catch (err) {
      setError('Falha ao processar análise de IA. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const updateSetting = (key: keyof AIRecommendationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getScoreColor = (score: number) => {
    if (score < 0.3) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    if (score < 0.5) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (score < 0.7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  const getFrequencyForNumber = (number: number) => {
    // Buscar a estatística real do número nas estatísticas de frequência
    const realStats = numberStatistics.find(stat => stat.number === number);
    return realStats ? realStats.frequency : 0;
  };

  // Fechar o modal de cópia automaticamente após 2.5 segundos
  useEffect(() => {
    if (showCopyModal) {
      const timer = setTimeout(() => {
        setShowCopyModal(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [showCopyModal]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Brain className="mr-2 text-green-600 dark:text-green-400" size={24} />
          Análise Avançada IA
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Configurações"
          >
            <Settings size={18} />
          </button>
          
          <button
            onClick={generateAnalysis}
            disabled={loading || processing || filteredResults.length === 0}
            className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-1 ${processing ? 'animate-spin' : ''}`} />
            Analisar
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-800 dark:text-blue-300 mb-4 flex items-start">
        <Info size={16} className="mr-2 flex-shrink-0 mt-0.5" />
        <p>
          Os números exibem a frequência real de cada dezena nos sorteios analisados, junto com o score da IA que pondera tendências recentes, padrões cíclicos e distribuições matemáticas para identificar números promissores.
        </p>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Configurações da Análise</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useHistoricalPatterns"
                checked={settings.useHistoricalPatterns}
                onChange={(e) => updateSetting('useHistoricalPatterns', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useHistoricalPatterns" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Usar Padrões Históricos
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useFrequencyAnalysis"
                checked={settings.useFrequencyAnalysis}
                onChange={(e) => updateSetting('useFrequencyAnalysis', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useFrequencyAnalysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Análise de Frequência
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useSumAnalysis"
                checked={settings.useSumAnalysis}
                onChange={(e) => updateSetting('useSumAnalysis', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useSumAnalysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Análise de Soma Total
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useParityAnalysis"
                checked={settings.useParityAnalysis}
                onChange={(e) => updateSetting('useParityAnalysis', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useParityAnalysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Análise de Paridade
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="balanceHotCold"
                checked={settings.balanceHotCold}
                onChange={(e) => updateSetting('balanceHotCold', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="balanceHotCold" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Equilibrar Números Quentes/Frios
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useFibonacciPatterns"
                checked={settings.useFibonacciPatterns}
                onChange={(e) => updateSetting('useFibonacciPatterns', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useFibonacciPatterns" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Padrões Fibonacci/Proporção Áurea
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useClusterAnalysis"
                checked={settings.useClusterAnalysis}
                onChange={(e) => updateSetting('useClusterAnalysis', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="useClusterAnalysis" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Análise de Clusters Numéricos
              </label>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="randomnessFactor" className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                Fator de Aleatoriedade: {settings.randomnessFactor.toFixed(2)}
              </label>
              <input
                type="range"
                id="randomnessFactor"
                min="0"
                max="1"
                step="0.05"
                value={settings.randomnessFactor}
                onChange={(e) => updateSetting('randomnessFactor', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="iterationDepth" className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                Profundidade de Iteração: {settings.iterationDepth || 10000}
              </label>
              <input
                type="range"
                id="iterationDepth"
                min="1000"
                max="20000"
                step="1000"
                value={settings.iterationDepth || 10000}
                onChange={(e) => updateSetting('iterationDepth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Valores maiores podem aumentar a precisão, mas tornam a análise mais lenta
              </span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Estas configurações permitem ajustar o comportamento do algoritmo. Altere-as de acordo com suas preferências de análise.
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md text-red-800 dark:text-red-300 mb-4">
          {error}
        </div>
      )}

      {(loading || processing) && (
        <div className="text-center py-10">
          <div className="inline-flex items-center px-4 py-2 bg-green-500/10 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
            <RefreshCw size={20} className="mr-2 animate-spin" />
            <span className="font-medium">Processando análise...</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Aplicando algoritmos de análise avançada aos dados dos sorteios...
          </p>
        </div>
      )}

      {!loading && !processing && aiResult && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Números Recomendados</h3>
            
            <div className="flex flex-wrap gap-3 justify-center mb-4 relative">
              {/* Ícones de dinheiro no fundo */}
              <span className="money-icon" style={{ left: '5%', top: '10%', animationDelay: '0.3s' }}>$</span>
              <span className="money-icon" style={{ left: '20%', top: '5%', animationDelay: '0.8s' }}>$</span>
              <span className="money-icon" style={{ left: '35%', top: '15%', animationDelay: '0.2s' }}>$</span>
              <span className="money-icon" style={{ left: '55%', top: '0%', animationDelay: '1.0s' }}>$</span>
              <span className="money-icon" style={{ left: '70%', top: '10%', animationDelay: '0.6s' }}>$</span>
              <span className="money-icon" style={{ left: '85%', top: '5%', animationDelay: '1.4s' }}>$</span>
              
              {/* Organização triangular das bolas verdes */}
              <div className="flex flex-col items-center w-full">
                {/* Primeira linha - 3 bolas */}
                <div className="flex justify-center gap-3 mb-4">
                  {aiResult.recommendedNumbers.slice(0, 3).map(number => {
                // Encontrar estatísticas deste número no heatmap
                const stats = aiResult.heatmap.find(item => item.number === number);
                
                return (
                  <div key={number} className="relative group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-xl shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-700">
                      {number}
                    </div>
                    
                    {/* Badge de frequência */}
                    {stats && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full w-8 h-8 flex flex-col items-center justify-center font-bold shadow-md border border-white dark:border-gray-700">
                        <span>{getFrequencyForNumber(number)}x</span>
                      </div>
                    )}
                    
                    {/* Tooltip com estatísticas - versão modernizada */}
                    <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 shadow-2xl z-10 w-56 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                      <div className="text-center mb-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-inner">
                          {number}
                        </span>
                        <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">Estatísticas</div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Barra de progresso para frequência */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Frequência</span>
                            <span className="text-xs font-bold">{getFrequencyForNumber(number)}x</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" 
                                 style={{ width: `${Math.min(100, getFrequencyForNumber(number) * 3)}%` }}></div>
                          </div>
                        </div>
                        
                        {/* Última aparição com ícone */}
                        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Última aparição</span>
                          </div>
                          <span className="font-semibold text-blue-700 dark:text-blue-300">{getLastAppearance(number)}</span>
                        </div>
                        
                        {/* Score IA com ícone */}
                        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 px-2 py-1.5 rounded-lg">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Score IA</span>
                        </div>
                          <span className="font-semibold text-amber-700 dark:text-amber-300">{stats ? Math.round(stats.score * 285) : '?'} pts</span>
                        </div>
                      </div>
                      
                      {/* Porcentagem de chance destaque */}
                      <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-lg text-white font-medium text-center shadow-sm">
                        <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                        <div className="text-base">{stats ? (stats.score * 100).toFixed(1) : '?'}%</div>
                      </div>
                      
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5 border-8 border-transparent border-t-gray-50 dark:border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}
                </div>
                
                {/* Segunda linha - 2 bolas */}
                <div className="flex justify-center gap-3 mb-4">
                  {aiResult.recommendedNumbers.slice(3, 5).map(number => {
                    // Encontrar estatísticas deste número no heatmap
                    const stats = aiResult.heatmap.find(item => item.number === number);
                    
                    return (
                      <div key={number} className="relative group">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-xl shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-700">
                          {number}
                        </div>
                        
                        {/* Badge de frequência */}
                        {stats && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full w-8 h-8 flex flex-col items-center justify-center font-bold shadow-md border border-white dark:border-gray-700">
                            <span>{getFrequencyForNumber(number)}x</span>
                          </div>
                        )}
                        
                        {/* Tooltip com estatísticas - versão modernizada */}
                        <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 shadow-2xl z-10 w-56 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                          <div className="text-center mb-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-inner">
                              {number}
                            </span>
                            <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">Estatísticas</div>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Barra de progresso para frequência */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Frequência</span>
                                <span className="text-xs font-bold">{getFrequencyForNumber(number)}x</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" 
                                     style={{ width: `${Math.min(100, getFrequencyForNumber(number) * 3)}%` }}></div>
                              </div>
                            </div>
                            
                            {/* Última aparição com ícone */}
                            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Última aparição</span>
                              </div>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">{getLastAppearance(number)}</span>
                            </div>
                            
                            {/* Score IA com ícone */}
                            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 px-2 py-1.5 rounded-lg">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Score IA</span>
                            </div>
                              <span className="font-semibold text-amber-700 dark:text-amber-300">{stats ? Math.round(stats.score * 285) : '?'} pts</span>
                            </div>
                          </div>
                          
                          {/* Porcentagem de chance destaque */}
                          <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-lg text-white font-medium text-center shadow-sm">
                            <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                            <div className="text-base">{stats ? (stats.score * 100).toFixed(1) : '?'}%</div>
                          </div>
                          
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5 border-8 border-transparent border-t-gray-50 dark:border-t-gray-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Terceira linha - 1 bola */}
                <div className="flex justify-center">
                  {aiResult.recommendedNumbers.slice(5, 6).map(number => {
                    // Encontrar estatísticas deste número no heatmap
                    const stats = aiResult.heatmap.find(item => item.number === number);
                    
                    return (
                      <div key={number} className="relative group">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-xl shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-700">
                          {number}
                        </div>
                        
                        {/* Badge de frequência */}
                        {stats && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full w-8 h-8 flex flex-col items-center justify-center font-bold shadow-md border border-white dark:border-gray-700">
                            <span>{getFrequencyForNumber(number)}x</span>
                          </div>
                        )}
                        
                        {/* Tooltip com estatísticas - versão modernizada */}
                        <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 text-xs rounded-xl py-3 px-4 shadow-2xl z-10 w-56 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                          <div className="text-center mb-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-inner">
                              {number}
                            </span>
                            <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">Estatísticas</div>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Barra de progresso para frequência */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Frequência</span>
                                <span className="text-xs font-bold">{getFrequencyForNumber(number)}x</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" 
                                     style={{ width: `${Math.min(100, getFrequencyForNumber(number) * 3)}%` }}></div>
                              </div>
                            </div>
                            
                            {/* Última aparição com ícone */}
                            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Última aparição</span>
                              </div>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">{getLastAppearance(number)}</span>
                            </div>
                            
                            {/* Score IA com ícone */}
                            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 px-2 py-1.5 rounded-lg">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">Score IA</span>
                            </div>
                              <span className="font-semibold text-amber-700 dark:text-amber-300">{stats ? Math.round(stats.score * 285) : '?'} pts</span>
                            </div>
                          </div>
                          
                          {/* Porcentagem de chance destaque */}
                          <div className="mt-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-lg text-white font-medium text-center shadow-sm">
                            <div className="text-xs opacity-80 mb-0.5">Probabilidade</div>
                            <div className="text-base">{stats ? (stats.score * 100).toFixed(1) : '?'}%</div>
                          </div>
                          
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5 border-8 border-transparent border-t-gray-50 dark:border-t-gray-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3 mt-2">
              <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg shadow-sm border border-green-100 dark:border-green-800/30">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">Índice de Confiança:</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">{aiResult.confidenceScore}%</span>
              </div>
              
              <button
                onClick={() => {
                  const numbers = aiResult.recommendedNumbers.join(', ');
                  navigator.clipboard.writeText(numbers);
                  setShowCopyModal(true);
                }}
                className="text-sm px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors flex items-center shadow-sm border border-green-200 dark:border-green-700/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Copiar números
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Insights da Análise</h3>
            <ul className="space-y-2">
              {aiResult.insights.map((insight, index) => (
                <li 
                  key={index}
                  className="flex items-start"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                    <Info size={12} />
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Padrões Detectados</h3>
            <div className="space-y-3">
              {aiResult.patterns.map((pattern, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{pattern.description}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {Math.round(pattern.confidence * 100)}% confiança
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Mapa de Calor dos Números</h3>
              <button
                onClick={() => {
                  const element = document.getElementById('heatmap-container');
                  if (element) {
                    element.scrollLeft = 0;
                  }
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Resetar visualização
              </button>
            </div>
            
            <div id="heatmap-container" className="overflow-x-auto pb-2 results-table-container">
              <div className="flex space-x-2 min-w-max p-2">
                {aiResult.heatmap.map(item => {
                  const realFreq = getFrequencyForNumber(item.number);
                  return (
                    <div
                      key={item.number}
                      className={`group flex flex-col items-center p-2 rounded-lg ${getScoreColor(item.score)} hover:shadow-md transition-all duration-200 relative`}
                    >
                      <div className="text-xs mb-1.5 font-medium flex flex-col items-center">
                        <span className="font-bold">{realFreq}x</span>
                        <span className="text-[10px] opacity-80 mt-0.5">({(item.score * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
                        {item.number}
                      </div>
                      
                      {/* Mini tooltip on hover */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-900 text-[10px] py-0.5 px-1.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-10 mobile-tooltip">
                        Nº {item.number}: {realFreq} sorteios
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>
              <span className="font-medium">Importante:</span> Esta análise utiliza algoritmos avançados para identificar padrões nos resultados históricos. 
              No entanto, a loteria é um jogo de azar e os resultados são aleatórios. 
              Use essas informações apenas como referência.
            </p>
            <p className="mt-2">
              Análise baseada em {filteredResults.length} resultados reais.
            </p>
          </div>
        </div>
      )}
      
      {!loading && !processing && !aiResult && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            Clique em "Analisar" para gerar recomendações baseadas em IA.
          </p>
        </div>
      )}
      
      {/* Modal de confirmação de cópia */}
      {showCopyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn" onClick={() => setShowCopyModal(false)}>
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"></div>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-2xl border border-green-200 dark:border-green-800 transform transition-all animate-scaleIn max-w-md w-11/12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 -right-4 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600 transition-colors" onClick={() => setShowCopyModal(false)}>
              ✕
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Números Copiados!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Os números foram copiados para a área de transferência.</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md text-center my-2">
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {aiResult?.recommendedNumbers.join(' - ')}
              </span>
            </div>
            <div className="text-center mt-4">
              <button 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition-colors w-full"
                onClick={() => setShowCopyModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationPanel; 