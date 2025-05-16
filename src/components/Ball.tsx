import React from 'react';

interface BallProps {
  number: number;
  isSelected: boolean;
  onToggle: (number: number) => void;
  disabled: boolean;
}

const Ball: React.FC<BallProps> = ({ number, isSelected, onToggle, disabled }) => {
  return (
    <div 
      className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer m-1 
                  ${isSelected 
                    ? 'bg-blue-500 text-white' 
                    : disabled 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30'
                  }
                  transition-colors duration-300 font-medium`}
      onClick={() => !disabled && onToggle(number)}
    >
      {number}
    </div>
  );
};

export default Ball; 