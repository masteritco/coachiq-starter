import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export default function ResumeUpload({ jobTitle, onSubmit, isLoading }) {
  const handleSubmit = () => {
    onSubmit(undefined, undefined); // Skip resume upload in demo
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-50 rounded-full">
            <FileText className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Documents (Optional)
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          For <span className="font-semibold text-blue-600">{jobTitle}</span> position
        </p>
        <p className="text-gray-600 mb-8">
          Upload your resume to get personalized questions based on your experience.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Mode</h3>
          <p className="text-gray-600 mb-4">
            File upload is not available in demo mode. Click continue to proceed with generic questions.
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
          Continue to Interview
        </button>
      </div>
    </div>
  );
}