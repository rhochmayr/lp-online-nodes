import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-gray-800 border-t-gray-400 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;