import React, { useState } from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function JobTitleInput({ onSubmit, isLoading }) {
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobTitle.trim() && !isLoading) {
      onSubmit(jobTitle.trim());
    }
  };

  const popularJobs = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Marketing Manager',
    'Sales Representative'
  ];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-full">
            <Briefcase className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What position are you interviewing for?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Enter your target job title and we'll generate personalized interview questions to help you practice and improve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 max-w-md mx-auto">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Software Engineer"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!jobTitle.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            Start
          </button>
        </div>
      </form>

      <div>
        <p className="text-sm text-gray-500 mb-4">Popular job titles:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {popularJobs.map((job) => (
            <button
              key={job}
              onClick={() => setJobTitle(job)}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {job}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
