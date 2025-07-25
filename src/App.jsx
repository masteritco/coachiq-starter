import React, { useState } from 'react';
import { Briefcase, ArrowRight, Trophy, MessageCircle, Send, User, Brain, RotateCcw } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState('job-input');
  const [jobTitle, setJobTitle] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    `Tell me about your experience relevant to this ${jobTitle} position.`,
    'Describe a challenging project you worked on and how you overcame obstacles.',
    'What interests you most about this role and our company?',
    'How do you stay current with industry trends and best practices?'
  ];

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (jobTitle.trim()) {
      setStage('interview');
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (currentAnswer.trim()) {
      setIsLoading(true);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAnswers = [...answers, {
        question: questions[currentQuestion],
        answer: currentAnswer,
        score: Math.floor(Math.random() * 3) + 7, // Random score 7-9
        feedback: `Good response! You provided relevant information and showed understanding of the question. Consider adding more specific examples to strengthen your answer. Remember to use the STAR method (Situation, Task, Action, Result) for behavioral questions.`
      }];
      
      setAnswers(newAnswers);
      setCurrentAnswer('');
      setIsLoading(false);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStage('results');
      }
    }
  };

  const startOver = () => {
    setStage('job-input');
    setJobTitle('');
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setIsLoading(false);
  };

  const downloadPDF = () => {
    alert('PDF download is not available in demo mode. This would normally download a comprehensive interview report.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={startOver} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CoachIQ</h1>
                <p className="text-sm text-gray-500">AI-Powered Interview Coaching</p>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Demo Mode</div>
              <div className="text-sm text-blue-600 font-medium">Free Plan: 4/4 interviews</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Input Stage */}
        {stage === 'job-input' && (
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

            <form onSubmit={handleJobSubmit} className="mb-8">
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <ArrowRight className="w-5 h-5" />
                  Start Interview
                </button>
              </div>
            </form>

            <div>
              <p className="text-sm text-gray-500 mb-4">Popular job titles:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager', 'Sales Representative'].map((job) => (
                  <button
                    key={job}
                    onClick={() => setJobTitle(job)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Features */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Demo Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  AI-generated interview questions
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time feedback and scoring
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Professional interview simulation
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Comprehensive results summary
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Stage */}
        {stage === 'interview' && (
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interview Question #{currentQuestion + 1}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {questions[currentQuestion]}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Take your time to provide a thoughtful response. Consider using the STAR method: Situation, Task, Action, Result..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!currentAnswer.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Getting AI Feedback...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
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
                Great job completing your {jobTitle} interview practice
              </p>
              
              {/* Overall Score */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Overall Score</h3>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {(answers.reduce((sum, a) => sum + a.score, 0) / answers.length).toFixed(1)}/10
                </div>
                <p className="text-gray-600">Average across all questions</p>
              </div>
            </div>

            {/* Questions and Responses */}
            <div className="space-y-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center">Your Responses & Feedback</h3>
              
              {answers.map((answer, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {answer.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{answer.question}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Your Answer:</h5>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{answer.answer}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">AI Feedback:</h5>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{answer.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <ArrowRight className="w-5 h-5" />
                Download PDF Report (Demo)
              </button>
              
              <button
                onClick={startOver}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">CoachIQ</h3>
                <p className="text-sm text-gray-500">AI-Powered Interview Coaching</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                About Us
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Terms
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Privacy
              </button>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">
                © 2025 CoachIQ. Demo Version - Built for job seekers worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}