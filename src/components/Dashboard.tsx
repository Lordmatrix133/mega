import React from 'react';
import Header from './Header';
import ResultsTable from './ResultsTable';
import StatisticsPanel from './StatisticsPanel';
import RecommendationBox from './RecommendationBox';
import DateFilter from './DateFilter';
import NextDrawInfo from './NextDrawInfo';
import ErrorAlert from './ErrorAlert';
import AIRecommendationPanel from './AIRecommendationPanel';
import UserInfo from './UserInfo';
import CompactBallSelector from './CompactBallSelector';
import { DataProvider } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

// Componente principal do Dashboard
const DashboardContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors overflow-x-hidden w-full">
      <Header />
      
      <main className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Painel de Análise da Mega Sena
            </h1>
            <DateFilter />
          </div>
          {user && (
            <div className="w-full lg:w-auto">
              <UserInfo user={user} />
            </div>
          )}
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
            <div className="space-y-6 lg:sticky lg:top-6">
              <section id="ball-selector">
                <CompactBallSelector />
              </section>
              
              <section id="recommendations">
                <RecommendationBox />
              </section>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 Mega Sena Analyzer - Apenas para fins informativos</p>
          <p className="mt-1"></p>
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