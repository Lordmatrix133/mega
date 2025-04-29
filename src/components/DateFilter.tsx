import React, { useState, useEffect, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const DateFilter: React.FC = () => {
  const { dateRange, setDateRange, results } = useData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [tempRange, setTempRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    setTempRange(dateRange);
  }, [dateRange]);

  // Fechar o filtro se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          filterBtnRef.current && 
          !filterBtnRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.date-filter-popup')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Verificar se já está no formato brasileiro (DD/MM/YYYY)
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return dateString; // Já está no formato correto
        }
      }
      
      // Tentar como data ISO ou outro formato
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.warn(`Erro ao formatar data para exibição: ${dateString}`, error);
      return dateString; // Retornar a string original em caso de erro
    }
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Verificar se está no formato brasileiro (DD/MM/YYYY)
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Criar data no formato YYYY-MM-DD para o input type="date"
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      
      // Tentar como data ISO ou outro formato
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn(`Erro ao formatar data para input: ${dateString}`, error);
      return ''; // Retornar string vazia em caso de erro
    }
  };

  const handleApply = () => {
    setDateRange(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setIsOpen(false);
  };

  const handleReset = () => {
    if (results.length > 0) {
      setTempRange({
        startDate: results[results.length - 1].data,
        endDate: results[0].data,
      });
    }
  };

  const getPresetRanges = () => {
    if (results.length === 0) return [];
    
    const lastDrawDate = new Date(results[0].data);
    
    return [
      {
        label: 'Últimos 10 sorteios',
        handler: () => {
          if (results.length >= 10) {
            setTempRange({
              startDate: results[Math.min(10, results.length) - 1].data,
              endDate: results[0].data,
            });
          }
        },
      },
      {
        label: 'Últimos 30 sorteios',
        handler: () => {
          if (results.length >= 30) {
            setTempRange({
              startDate: results[Math.min(30, results.length) - 1].data,
              endDate: results[0].data,
            });
          }
        },
      },
      {
        label: 'Últimos 90 sorteios',
        handler: () => {
          if (results.length >= 90) {
            setTempRange({
              startDate: results[Math.min(90, results.length) - 1].data,
              endDate: results[0].data,
            });
          }
        },
      },
      {
        label: 'Ano atual',
        handler: () => {
          const startOfYear = new Date(lastDrawDate.getFullYear(), 0, 1).toISOString();
          setTempRange({
            startDate: startOfYear,
            endDate: results[0].data,
          });
        },
      },
      {
        label: 'Todo período',
        handler: handleReset,
      },
    ];
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        ref={filterBtnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
      >
        <Calendar size={16} />
        <span>
          {dateRange.startDate && dateRange.endDate
            ? `${formatDateForDisplay(dateRange.startDate)} - ${formatDateForDisplay(dateRange.endDate)}`
            : 'Todo período'}
        </span>
      </button>

      {isOpen && (
        <div className="date-filter-popup fixed sm:absolute left-1/2 sm:left-auto top-1/2 sm:top-full transform -translate-x-1/2 sm:-translate-x-0 -translate-y-1/2 sm:-translate-y-0 sm:right-0 sm:mt-2 w-80 sm:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 transition-all">
          <div className="relative p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Período</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={formatDateForInput(tempRange.startDate)}
                  onChange={(e) => setTempRange({ ...tempRange, startDate: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Data Final</label>
                <input
                  type="date"
                  value={formatDateForInput(tempRange.endDate)}
                  onChange={(e) => setTempRange({ ...tempRange, endDate: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Seleção Rápida</h4>
              <div className="flex flex-wrap gap-2">
                {getPresetRanges().map((preset, index) => (
                  <button
                    key={index}
                    onClick={preset.handler}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Resetar
                </button>
                <button
                  onClick={handleApply}
                  className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
            
            {/* Overlay de fundo para dispositivos móveis */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] sm:hidden" onClick={() => setIsOpen(false)}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;