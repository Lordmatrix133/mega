import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div
        className={`${
          type === 'success'
            ? 'bg-green-600 text-white dark:bg-green-500'
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        } px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className={`p-1 rounded-full transition-colors ${
            type === 'success'
              ? 'hover:bg-white/20'
              : 'hover:bg-black/5'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 