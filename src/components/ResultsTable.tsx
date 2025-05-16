import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatDate, formatCurrency } from '../utils/helpers';
import ResultDetail from './ResultDetail';
import { MegaSenaResult } from '../types';

const ResultsTable: React.FC = () => {
  const { filteredResults = [], loading, refreshData, error } = useData();
  const [sortField, setSortField] = useState<string>('concurso');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedResult, setSelectedResult] = useState<MegaSenaResult | null>(null);
  const resultsPerPage = 10;

  const sortedResults = [...(Array.isArray(filteredResults) ? filteredResults : [])].sort((a, b) => {
    if (sortField === 'concurso') {
      return sortDirection === 'asc' 
        ? a.concurso - b.concurso 
        : b.concurso - a.concurso;
    }
    
    if (sortField === 'data') {
      return sortDirection === 'asc' 
        ? new Date(a.data).getTime() - new Date(b.data).getTime() 
        : new Date(b.data).getTime() - new Date(a.data).getTime();
    }
    
    if (sortField === 'premiacoes') {
      const aValue = a.premiacoes[0]?.ganhadores || 0;
      const bValue = b.premiacoes[0]?.ganhadores || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleOpenDetails = (result: MegaSenaResult) => {
    setSelectedResult(result);
  };

  const handleCloseDetails = () => {
    setSelectedResult(null);
  };

  if (filteredResults.length === 0 && !loading && !error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 py-8">
          Nenhum resultado disponível. Por favor, verifique sua conexão e tente novamente.
        </p>
        <button 
          onClick={() => refreshData()}
          className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Atualizar Dados
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Resultados Recentes</h2>
        <button 
          onClick={() => refreshData()}
          className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="results-table-container">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('concurso')}
              >
                <div className="flex items-center">
                  Concurso
                  {sortField === 'concurso' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('data')}
              >
                <div className="flex items-center">
                  Data
                  {sortField === 'data' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Números
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('premiacoes')}
              >
                <div className="flex items-center">
                  Ganhadores (6)
                  {sortField === 'premiacoes' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prêmio
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Local
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Carregando resultados...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Erro ao carregar resultados. Por favor, tente novamente.
                </td>
              </tr>
            ) : filteredResults.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            ) : (
              paginatedResults.map((result) => (
                <tr key={result.concurso} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleOpenDetails(result)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      title="Ver detalhes"
                    >
                      <Info size={18} />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {result.concurso}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(result.data)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {result.dezenas.map((numero, index) => (
                        <div 
                          key={index} 
                          className="mega-number-sm"
                        >
                          {numero}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.premiacoes[0]?.ganhadores || 0}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.premiacoes[0]?.ganhadores > 0 
                      ? formatCurrency(result.premiacoes[0]?.valorPremio || result.premiacoes[0]?.premio || 0) 
                      : result.acumulou ? 'Acumulado' : '-'
                    }
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                    {result.local ? result.local.split('em')[1]?.trim() || result.local : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <ChevronLeft size={16} className="mr-1" />
            Anterior
          </button>
          
          <div className="pagination-info">
            <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Próxima
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
      
      {selectedResult && (
        <ResultDetail 
          result={selectedResult} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default ResultsTable;