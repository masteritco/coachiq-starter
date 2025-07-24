import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';

export default function AboutUs({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Interview Coach
      </button>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-full">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About CoachIQ</h1>
        <p className="text-lg text-gray-600">
          Your personal AI-powered interview coach
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            CoachIQ is your personal AI-powered interview coach — built to help job seekers gain confidence, 
            improve their answers, and succeed in today's competitive job market.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We believe that everyone deserves access to high-quality, affordable interview preparation, 
            no matter their background, role, or experience level.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            This is a demo version showcasing the core functionality of CoachIQ.
          </p>
        </div>
      </div>
    </div>
  );
}