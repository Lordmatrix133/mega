import React, { useState, useEffect, useRef } from 'react';
import { Calendar, X, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'range' | 'presets'>('range');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

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

  // Reset selected preset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPreset(null);
    }
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
    setSelectedPreset(null);
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setIsOpen(false);
    setSelectedPreset(null);
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
            setSelectedPreset(0);
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
            setSelectedPreset(1);
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
            setSelectedPreset(2);
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
          setSelectedPreset(3);
        },
      },
      {
        label: 'Todo período',
        handler: () => {
          handleReset();
          setSelectedPreset(4);
        },
      },
    ];
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        ref={filterBtnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm bg-transparent dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto justify-center sm:justify-start"
      >
        <Calendar size={16} className="text-green-600 dark:text-green-400" />
        <span className="text-gray-700 dark:text-white font-medium">
          {dateRange.startDate && dateRange.endDate ? (
            <span>
              <span className="font-semibold dark:font-bold">{formatDateForDisplay(dateRange.startDate)}</span>
              <span className="mx-1">-</span>
              <span className="font-semibold dark:font-bold">{formatDateForDisplay(dateRange.endDate)}</span>
            </span>
          ) : (
            'Todo período'
          )}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay de fundo */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="date-filter-popup fixed sm:absolute left-1/2 sm:left-auto top-1/2 sm:top-full transform -translate-x-1/2 sm:-translate-x-0 -translate-y-1/2 sm:-translate-y-0 sm:right-0 sm:mt-4 w-[320px] sm:w-[340px] bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 dark:bg-green-600"></div>
            
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Filtrar Período</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  onClick={() => setActiveTab('range')}
                  className={`py-2 px-4 text-sm font-medium relative ${
                    activeTab === 'range' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Intervalo de Datas
                  {activeTab === 'range' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 dark:bg-green-500"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`py-2 px-4 text-sm font-medium relative ${
                    activeTab === 'presets' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Seleção Rápida
                  {activeTab === 'presets' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 dark:bg-green-500"></span>
                  )}
                </button>
              </div>

              <div className="min-h-[180px]">
                {activeTab === 'range' && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-800/30 mr-3">
                        <ChevronRight size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 font-medium">Data Inicial</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formatDateForInput(tempRange.startDate)}
                            onChange={(e) => setTempRange({ ...tempRange, startDate: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-800/30 mr-3">
                        <ChevronLeft size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1 font-medium">Data Final</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formatDateForInput(tempRange.endDate)}
                            onChange={(e) => setTempRange({ ...tempRange, endDate: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-500 focus:border-green-500"
                          />
                          <style>{`
                          /* Estilização dos ícones de calendário nos campos de data */
                          input[type="date"]::-webkit-calendar-picker-indicator {
                            filter: invert(1) brightness(0.8) sepia(100%) saturate(400%) hue-rotate(90deg);
                            opacity: 0.8;
                          }
                          
                          /* Versão para modo claro */
                          @media (prefers-color-scheme: light) {
                            input[type="date"]::-webkit-calendar-picker-indicator {
                              filter: invert(0.5) sepia(100%) saturate(400%) hue-rotate(90deg);
                              opacity: 0.7;
                            }
                          }
                          `}</style>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'presets' && (
                  <div className="grid grid-cols-1 gap-2">
                    {getPresetRanges().map((preset, index) => {
                      const isSelected = selectedPreset === index;
                      return (
                        <button
                          key={index}
                          onClick={preset.handler}
                          className={`flex items-center text-left px-3 py-2.5 border rounded-lg ${
                            isSelected
                              ? 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-700 text-green-700 dark:text-green-400'
                              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-300 dark:hover:border-green-700'
                          } group`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                            isSelected
                              ? 'bg-green-100 dark:bg-green-800/50'
                              : 'bg-gray-100 dark:bg-gray-600 group-hover:bg-green-100 dark:group-hover:bg-green-800/30'
                          }`}>
                            <Calendar size={14} className={`${
                              isSelected
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'
                            }`} />
                          </div>
                          <span className="text-sm font-medium">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Resetar
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-1.5 text-sm font-medium bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateFilter;