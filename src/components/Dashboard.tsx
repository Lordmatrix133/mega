import React from 'react';
import Header from './Header';
import ResultsTable from './ResultsTable';
import StatisticsPanel from './StatisticsPanel';
import RecommendationBox from './RecommendationBox';
import DateFilter from './DateFilter';
import NextDrawInfo from './NextDrawInfo';
import ErrorAlert from './ErrorAlert';
import AIRecommendationPanel from './AIRecommendationPanel';
import { DataProvider } from '../contexts/DataContext';

// Componente principal do Dashboard
const DashboardContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors overflow-x-hidden w-full">
      <Header />
      
      <main className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Painel de Análise da Mega Sena</h1>
          <DateFilter />
        </div>

        <ErrorAlert />

        <NextDrawInfo />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <section id="dashboard">
                <ResultsTable />
              </section>
              
              <section id="statistics" className="scrollbar-hide">
                <StatisticsPanel />
              </section>
              
              <section id="ai-analyzer" className="scrollbar-hide">
                <AIRecommendationPanel />
              </section>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <section id="recommendations" className="lg:sticky lg:top-6">
              <RecommendationBox />
            </section>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          <p>© 2025 Mega Sena Analyzer - Apenas para fins informativos</p>
          <p className="mt-1">Resultados anteriores não garantem resultados futuros. Jogue com responsabilidade.</p>
        </footer>
      </main>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
};

export default Dashboard;