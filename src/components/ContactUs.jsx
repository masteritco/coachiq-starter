import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ContactUs({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to CoachIQ
      </button>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-full">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">Demo version</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-gray-700">
          This is a demo version of CoachIQ. In the full version, you would be able to contact our support team.
        </p>
      </div>
    </div>
  );
}