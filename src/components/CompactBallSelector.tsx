import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Eye, Clock, Star } from 'lucide-react';
import Ball from './Ball';
import SelectedBall from './SelectedBall';
import { useData } from '../contexts/DataContext';
import SaveGameModal from './SaveGameModal';
import SavedGamesList from './SavedGamesList';
import { saveGame, loadUserGames, deleteGame, SavedGame } from '../lib/supabase';
import Toast from './Toast';
import { useSound } from '../hooks/useSound';

const CompactBallSelector: React.FC = () => {
  const [selectedBalls, setSelectedBalls] = useState<number[]>([]);
  const [matchedBalls, setMatchedBalls] = useState<number[]>([]);
  const [temporaryMatches, setTemporaryMatches] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isGamesListExpanded, setIsGamesListExpanded] = useState(false);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [previewSeconds, setPreviewSeconds] = useState<number>(0);
  const [isWaitingResult, setIsWaitingResult] = useState(false);
  
  // Usar o contexto de dados para acessar os resultados
  const { filteredResults, loading: dataLoading, error: dataError } = useData();
  
  // Estado para armazenar o último resultado da Mega-Sena
  const [lastResult, setLastResult] = useState<number[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [lastConcurso, setLastConcurso] = useState<string>('');
  const [lastDate, setLastDate] = useState<string>('');
  
  // Definir o número total de bolas e máximo que pode ser selecionado (regras da Mega-Sena)
  const totalBalls = 60;
  const ballsPerRow = 10;
  const maxSelectable = 6; // Aposta mínima da Mega-Sena (6 números)

  // Adicionar o hook de som
  const { play: playBubbleSound } = useSound('/sounds/bubble-sound-43207.mp3');
  
  // Carregar jogos salvos do Supabase
  useEffect(() => {
    loadSavedGames();
  }, []);

  // Limpar seleção quando não houver mais jogos salvos
  useEffect(() => {
    if (savedGames.length === 0) {
      clearSelection();
      setHasCompared(false);
      setLastResult([]);
      setLastConcurso('');
      setLastDate('');
      setMatchedBalls([]);
      setTemporaryMatches([]);
    }
  }, [savedGames]);

  // Função para carregar jogos salvos
  const loadSavedGames = async () => {
    try {
      const games = await loadUserGames();
      setSavedGames(games || []);
    } catch (error) {
      showToast('error', 'Erro ao carregar jogos salvos');
    }
  };

  // Função para mostrar toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  // Função para obter o último resultado da Mega-Sena do contexto
  const getLatestResultFromContext = () => {
    setIsLoadingResult(true);
    setResultError(null);
    
    try {
      // Verificar se temos resultados disponíveis
      if (filteredResults && filteredResults.length > 0) {
        // Pegar o primeiro resultado (mais recente)
        const latestResult = filteredResults[0];
        
        // Converter as dezenas (strings) para números
        const dezenas = latestResult.dezenas.map(d => parseInt(d, 10));
        
        setLastResult(dezenas);
        setLastConcurso(latestResult.concurso.toString());
        setLastDate(latestResult.data);
        return;
      }
      
      throw new Error("Nenhum resultado disponível no contexto");
    } catch (error) {
      setResultError("Não foi possível obter o último resultado. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoadingResult(false);
    }
  };
  
  // Obter o último resultado quando o componente montar ou os resultados mudarem
  useEffect(() => {
    if (!dataLoading) {
      getLatestResultFromContext();
    }
    
    return () => {
      // Limpar timeout ao desmontar componente
      if (tooltipTimeoutRef.current) {
        window.clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [filteredResults, dataLoading]);
  
  const toggleBall = (number: number) => {
    // Se já está selecionado, podemos sempre remover
    if (selectedBalls.includes(number)) {
      setSelectedBalls(prev => prev.filter(ball => ball !== number));
      playBubbleSound();
      
      // Se estiver em modo de comparação, também remove da lista de correspondências
      if (hasCompared) {
        setMatchedBalls(prev => prev.filter(ball => ball !== number));
      }
      return;
    }
    
    // Se não está selecionado, verificar se já atingiu o máximo
    if (selectedBalls.length >= maxSelectable) {
      // Mostrar tooltip
      setShowTooltip(true);
      
      // Esconder tooltip após 3 segundos
      if (tooltipTimeoutRef.current) {
        window.clearTimeout(tooltipTimeoutRef.current);
      }
      
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(false);
        tooltipTimeoutRef.current = null;
      }, 3000);
      
      return;
    }
    
    // Adicionar bola à seleção (mantendo a ordem de seleção)
    setSelectedBalls(prev => [...prev, number]);
    playBubbleSound();
    
    // Se estiver em modo de comparação, verifica se essa nova bola é uma correspondência
    if (hasCompared && lastResult.includes(number)) {
      setMatchedBalls(prev => [...prev, number]);
    }
  };

  // Função para limpar todas as bolas selecionadas
  const clearSelection = () => {
    setSelectedBalls([]);
    setMatchedBalls([]);
    setHasCompared(false);
  };
  
  // Função para comparar os números selecionados com o último resultado
  const compareWithLastResult = () => {
    // Verifica se temos um resultado para comparar
    if (lastResult.length === 0) {
      setResultError("Não há resultado disponível para comparação.");
      return;
    }
    
    // Verifica os números que correspondem
    const matches = selectedBalls.filter(ball => 
      lastResult.some(resultBall => Number(resultBall) === Number(ball))
    );
    
    // Define os acertos temporários
    setTemporaryMatches(matches);
    setPreviewSeconds(20);
    
    // Inicia o contador regressivo
    const interval = setInterval(() => {
      setPreviewSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Agenda a remoção dos acertos temporários após 20 segundos
    setTimeout(() => {
      setTemporaryMatches([]);
      setPreviewSeconds(0);
      clearInterval(interval);
    }, 20000);
    
    setMatchedBalls(matches);
    setHasCompared(true);
  };

  // Função para salvar um novo jogo
  const handleSaveGame = async (gameName: string) => {
    setLoading(true);
    try {
      await saveGame(gameName, selectedBalls);
      await loadSavedGames(); // Recarregar a lista de jogos
      setShowSaveModal(false);
      showToast('success', 'Jogo salvo com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao salvar o jogo');
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar um jogo salvo
  const handleLoadGame = (game: SavedGame) => {
    setSelectedBalls(game.numbers);
    setMatchedBalls([]);
    setHasCompared(false);
    showToast('success', 'Jogo carregado com sucesso!');
  };

  // Função para excluir um jogo salvo
  const handleDeleteGame = async (gameId: string) => {
    setLoading(true);
    try {
      await deleteGame(gameId);
      await loadSavedGames(); // Recarregar a lista de jogos
      showToast('success', 'Jogo excluído com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao excluir o jogo');
    } finally {
      setLoading(false);
    }
  };
  
  // Criar matriz para representar a tabela
  const rows = [];
  for (let i = 0; i < totalBalls; i += ballsPerRow) {
    const row = [];
    for (let j = 0; j < ballsPerRow && i + j < totalBalls; j++) {
      const number = i + j + 1; // Começar do 1 em vez de 0
      const isMaxSelected = selectedBalls.length >= maxSelectable;
      row.push(
        <Ball 
          key={number} 
          number={number} 
          isSelected={selectedBalls.includes(number)} 
          onToggle={toggleBall}
          disabled={isMaxSelected && !selectedBalls.includes(number)}
        />
      );
    }
    rows.push(<div key={i} className="flex flex-row justify-center">{row}</div>);
  }
  
  // Função para verificar se está no horário de aguardar resultado
  const checkWaitingResultTime = () => {
    const now = new Date();
    const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const hours = brasiliaTime.getHours();
    
    // Se for após as 20h e não tivermos o último resultado do dia
    if (hours >= 20 && (!lastResult || lastResult.length === 0)) {
      setIsWaitingResult(true);
    } else {
      setIsWaitingResult(false);
    }
  };

  // Verificar o status a cada minuto
  useEffect(() => {
    checkWaitingResultTime();
    const interval = setInterval(checkWaitingResultTime, 60000);
    return () => clearInterval(interval);
  }, [lastResult]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full relative">
      {/* Toast component */}
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Registre seu jogo</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Selecione os números da sua aposta para registrá-los e acompanhar seu desempenho
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Selecione exatamente {maxSelectable} números para uma aposta simples
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-14 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm shadow-md z-10 animate-fadeIn">
          Você só pode selecionar {maxSelectable} números por aposta simples
        </div>
      )}

      {/* Lista de jogos salvos */}
      <div className="mb-4">
        <SavedGamesList
          games={savedGames}
          isExpanded={isGamesListExpanded}
          onToggleExpand={() => setIsGamesListExpanded(!isGamesListExpanded)}
          onSelectGame={handleLoadGame}
          onDeleteGame={handleDeleteGame}
        />
      </div>
      
      {/* Tabela de bolas */}
      <div className="mb-4">
        {rows}
      </div>
      
      {/* Sequência selecionada */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            Números selecionados:
            {temporaryMatches.length > 0 && previewSeconds > 0 && (
              <span className="ml-2 text-green-500 flex items-center gap-1">
                <Eye size={16} className="inline-block" />
                Preview ({previewSeconds}s)
              </span>
            )}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedBalls.length}/{maxSelectable}
            </span>
            {selectedBalls.length > 0 && (
              <button 
                onClick={clearSelection}
                className="w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors"
                title="Limpar seleção"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        
        {/* Container das bolas selecionadas */}
        <div className="flex flex-wrap justify-center">
          {selectedBalls.length > 0 ? (
            selectedBalls.map(number => (
              <SelectedBall 
                key={`selected-${number}`} 
                number={number} 
                matched={matchedBalls.includes(number)}
                temporaryMatch={temporaryMatches.includes(number)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm py-4">Nenhum número selecionado</p>
          )}
        </div>
        
        {/* Último sorteio */}
        {hasCompared && (
          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Último resultado sorteado:</h4>
              {lastConcurso && lastDate && (
                <span className="text-xs text-gray-500">
                  Concurso {lastConcurso} - {lastDate}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center mb-2">
              {isLoadingResult || dataLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-gray-500 mr-2" size={16} />
                  <span className="text-sm text-gray-500">Carregando resultado...</span>
                </div>
              ) : resultError ? (
                <div className="text-red-500 text-sm py-2">{resultError}</div>
              ) : (
                lastResult.map(number => (
                  <div 
                    key={`result-${number}`}
                    className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center m-1 text-xs font-medium"
                  >
                    {number}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Resultado da comparação */}
        {hasCompared && !isLoadingResult && !dataLoading && !resultError && (
          <div className="mt-2 text-center">
            <p className="text-sm font-medium">
              {matchedBalls.length > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  Você acertou {matchedBalls.length} número{matchedBalls.length !== 1 ? 's' : ''}! 
                  <CheckCircle2 className="inline ml-1" size={16} />
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">
                  Nenhum acerto desta vez.
                </span>
              )}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <button 
          onClick={compareWithLastResult}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-md text-sm shadow-sm transition-colors flex items-center"
          disabled={selectedBalls.length === 0 || isLoadingResult || dataLoading}
        >
          {(isLoadingResult || dataLoading) && <Loader2 className="animate-spin mr-1" size={14} />}
          Comparar
        </button>
        <button 
          onClick={() => setShowSaveModal(true)}
          className={`${selectedBalls.length === maxSelectable 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'} 
            text-white font-medium py-1.5 px-4 rounded-md text-sm shadow-sm transition-colors`}
          disabled={selectedBalls.length !== maxSelectable}
        >
          Salvar Jogo
        </button>
      </div>

      {/* Modal de salvar jogo */}
      <SaveGameModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveGame}
        selectedNumbers={selectedBalls}
        loading={loading}
      />

      {/* Mensagem de aguardando resultado */}
      {isWaitingResult && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
          <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
          <div>
            <p className="font-medium text-lg">Aguardando Resultado</p>
            <p className="text-sm opacity-90">Boa Sorte!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactBallSelector; 