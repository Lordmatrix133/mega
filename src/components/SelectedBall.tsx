import React from 'react';

interface SelectedBallProps {
  number: number;
  matched?: boolean;
  temporaryMatch?: boolean;
}

const SelectedBall: React.FC<SelectedBallProps> = ({ 
  number, 
  matched = false,
  temporaryMatch = false
}) => {
  return (
    <div 
      className={`
        w-12 h-12 rounded-full flex items-center justify-center mx-1 my-2
        text-lg font-bold shadow-md transition-all duration-300 transform hover:scale-110
        ${temporaryMatch
          ? 'bg-green-500 text-white'
          : 'bg-blue-500 text-white'
        }
      `}
    >
      {number}
    </div>
  );
};

export default SelectedBall; 