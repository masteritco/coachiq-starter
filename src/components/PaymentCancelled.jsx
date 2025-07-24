import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelled({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h2>
        <p className="text-lg text-gray-600">
          This is demo mode - no actual payment was attempted.
        </p>
      </div>

      <button
        onClick={onBack}
        className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium mx-auto"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Demo
      </button>
    </div>
  );
}