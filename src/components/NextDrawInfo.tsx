import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatCurrency, getNextDrawDetails } from '../utils/helpers';

const NextDrawInfo: React.FC = () => {
  const { filteredResults = [], refreshData, loading } = useData();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);
  
  const nextDrawInfo = filteredResults[0] || null;

  useEffect(() => {
    if (!nextDrawInfo) return;
    
    const calculateTimeLeft = () => {
      // Usar a função utilitária para obter a data do próximo sorteio
      const { date: drawDate, isDrawDay } = getNextDrawDetails(nextDrawInfo.dataProximoConcurso);
      
      // Se não for um dia oficial de sorteio (terça, quinta, sábado)
      if (!isDrawDay) {
        setTimeLeft("Atenção: Não é um dia oficial de sorteio!");
        setSeconds(0);
        return;
      }
      
      // Ajustar para o fuso horário brasileiro (UTC-3)
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000;
      const localTime = new Date(now.getTime() - timezoneOffset);
      
      // Se a data já passou, mostrar "Resultado em breve"
      if (drawDate < localTime) {
        setTimeLeft("Resultado em breve");
        setSeconds(0);
        return;
      }
      
      const difference = drawDate.getTime() - localTime.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);
      
      setSeconds(secs);
      
      let timeLeftString = '';
      
      if (days > 0) {
        timeLeftString += `${days} dia${days > 1 ? 's' : ''} `;
      }
      
      if (hours > 0 || days > 0) {
        timeLeftString += `${hours} hora${hours > 1 ? 's' : ''} `;
      }
      
      timeLeftString += `${minutes} min ${secs} seg`;
      
      setTimeLeft(timeLeftString);
    };
    
    // Atualizar a cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    
    return () => clearInterval(timer);
  }, [nextDrawInfo]);

  if (!nextDrawInfo) {
    return null;
  }

  // Obter os detalhes formatados da data do próximo sorteio usando a nova função utilitária
  const { date: nextDrawDate, formattedDay: drawDay, formattedMonth: drawMonth, diaSemana, isDrawDay } = 
    getNextDrawDetails(nextDrawInfo.dataProximoConcurso);
  
  const drawHour = '20';
  const drawMinute = '00';
  
  // Calcular o aumento do prêmio em relação ao sorteio anterior
  const previousDrawPrize = parseFloat(String(filteredResults[1]?.valorEstimadoProximoConcurso || "0"));
  const currentDrawPrize = parseFloat(String(nextDrawInfo.valorEstimadoProximoConcurso));
  const prizeIncrease = previousDrawPrize > 0 
    ? ((currentDrawPrize - previousDrawPrize) / previousDrawPrize) * 100 
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Próximo Sorteio</h2>
        <button 
          onClick={() => refreshData()}
          className="flex items-center px-2 py-1 text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Data do Sorteio</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {diaSemana}, {drawDay}/{drawMonth}
              {!isDrawDay && (
                <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  Não é dia de sorteio!
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Concurso <span className="font-medium text-gray-700 dark:text-white">{nextDrawInfo.concurso + 1}</span> às <span className="font-medium text-gray-700 dark:text-white">{drawHour}:{drawMinute}h</span>
              {!isDrawDay && (
                <span className="ml-2 text-red-600 dark:text-red-400">
                  Os sorteios oficiais são realizados às terças, quintas e sábados.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg relative overflow-hidden">
          <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Prêmio Estimado</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <span className="relative z-10">{formatCurrency(nextDrawInfo.valorEstimadoProximoConcurso)}</span>
            </p>
            <div className="flex items-center">
              {nextDrawInfo.acumulou && (
                <span className="acumulou-badge flex items-center text-xs mr-2">
                  <span className="inline-block rounded-full px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold animate-pulse">
                    ACUMULOU!
                  </span>
                </span>
              )}
              
              {prizeIncrease > 0 && (
                <span className="text-xs flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp size={12} className="mr-1" /> 
                  +{prizeIncrease.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          
          {/* Cifrões animados */}
          <span className="money-icon text-yellow-500 dark:text-yellow-400 font-bold text-sm" style={{ left: '10%', top: '20%', animationDelay: '0s' }}>$</span>
          <span className="money-icon text-yellow-500 dark:text-yellow-400 font-bold text-sm" style={{ left: '25%', top: '30%', animationDelay: '0.7s' }}>$</span>
          <span className="money-icon text-yellow-500 dark:text-yellow-400 font-bold text-sm" style={{ left: '40%', top: '15%', animationDelay: '1.4s' }}>$</span>
          <span className="money-icon text-yellow-500 dark:text-yellow-400 font-bold text-sm" style={{ left: '60%', top: '25%', animationDelay: '0.4s' }}>$</span>
          <span className="money-icon text-yellow-500 dark:text-yellow-400 font-bold text-sm" style={{ left: '80%', top: '20%', animationDelay: '1.1s' }}>$</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Contagem Regressiva</h3>
            <p className={`text-lg font-semibold ${!isDrawDay ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
              {timeLeft || "Calculando..."}
            </p>
            <div className={`mt-1 w-full ${!isDrawDay ? 'bg-red-200 dark:bg-red-900/30' : 'bg-gray-200 dark:bg-gray-700'} h-1.5 rounded-full overflow-hidden`}>
              {isDrawDay && (
                <div 
                  className="bg-blue-500 dark:bg-blue-400 h-full animate-pulse" 
                  style={{ 
                    width: `${(seconds / 60) * 100}%`, 
                    transition: 'width 1s linear' 
                  }}
                ></div>
              )}
              {!isDrawDay && (
                <div 
                  className="bg-red-500 dark:bg-red-400 h-full animate-pulse" 
                  style={{ width: '100%' }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextDrawInfo;