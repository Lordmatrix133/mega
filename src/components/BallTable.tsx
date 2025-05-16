import React, { useState } from 'react';

interface BallProps {
  number: number;
  isSelected: boolean;
  onToggle: (number: number) => void;
}

const Ball: React.FC<BallProps> = ({ number, isSelected, onToggle }) => {
  return (
    <div 
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer m-2 
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}
                  transition-colors duration-300 hover:bg-blue-300`}
      onClick={() => onToggle(number)}
    >
      {number}
    </div>
  );
};

const BallTable: React.FC = () => {
  const [selectedBalls, setSelectedBalls] = useState<number[]>([]);
  
  // Definir o número total de bolas (por exemplo, 60 para Mega-Sena)
  const totalBalls = 60;
  const ballsPerRow = 10;
  
  const toggleBall = (number: number) => {
    setSelectedBalls(prev => 
      prev.includes(number) 
        ? prev.filter(ball => ball !== number) 
        : [...prev, number]
    );
  };
  
  // Criar matriz para representar a tabela
  const rows = [];
  for (let i = 0; i < totalBalls; i += ballsPerRow) {
    const row = [];
    for (let j = 0; j < ballsPerRow && i + j < totalBalls; j++) {
      const number = i + j + 1; // Começar do 1 em vez de 0
      row.push(
        <Ball 
          key={number} 
          number={number} 
          isSelected={selectedBalls.includes(number)} 
          onToggle={toggleBall} 
        />
      );
    }
    rows.push(<div key={i} className="flex flex-row justify-center">{row}</div>);
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Escolha seus números</h2>
      
      {/* Tabela de bolas */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        {rows}
      </div>
      
      {/* Sequência selecionada */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Números selecionados</h3>
        <div className="flex flex-wrap justify-center">
          {selectedBalls.length > 0 ? (
            selectedBalls
              .sort((a, b) => a - b)
              .map(number => (
                <div 
                  key={`selected-${number}`}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center m-1"
                >
                  {number}
                </div>
              ))
          ) : (
            <p className="text-gray-500">Nenhum número selecionado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BallTable; 