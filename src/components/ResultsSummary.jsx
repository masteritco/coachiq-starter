import React from 'react';
import { Trophy, TrendingUp, Download, RotateCcw } from 'lucide-react';

export default function ResultsSummary({ session, onDownloadPDF, onStartOver }) {
  const averageScore = session.responses.reduce((sum, r) => sum + r.score, 0) / session.responses.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-50 rounded-full">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Interview Complete! 🎉
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Great job completing your {session.jobTitle} interview practice
        </p>
        
        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Overall Score</h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {averageScore.toFixed(1)}/10
          </div>
          <p className="text-gray-600">Average across all questions</p>
        </div>
      </div>

      {/* Questions and Responses */}
      <div className="space-y-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Your Responses & Feedback</h3>
        
        {session.responses.map((response, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {response.score}/10
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{response.question}</p>
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Your Answer:</h5>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{response.answer}</p>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">AI Feedback:</h5>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{response.feedback}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDownloadPDF}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Download className="w-5 h-5" />
          Download PDF Report
        </button>
        
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Interview
        </button>
      </div>
    </div>
  );
}