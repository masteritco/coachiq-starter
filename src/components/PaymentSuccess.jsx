import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccess({ onContinue }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-50 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h2>
        <p className="text-lg text-gray-600">
          This is demo mode - no actual payment was processed.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium mx-auto"
      >
        <ArrowRight className="w-5 h-5" />
        Continue Demo
      </button>
    </div>
  );
}