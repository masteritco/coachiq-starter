import React from 'react';

export default function LoadingSpinner({ message }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600">This may take a few moments...</p>
    </div>
  );
}
