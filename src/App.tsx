import React from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  React.useEffect(() => {
    document.title = 'Mega Sena Analyzer - Dashboard';
  }, []);

  return <Dashboard />;
}

export default App;