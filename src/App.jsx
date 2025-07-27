import React, { useState } from 'react';
import { Briefcase, ArrowRight, Trophy, MessageCircle, Send, Brain, RotateCcw, Download, User, LogOut, Sparkles, Star, CheckCircle } from 'lucide-react';
import { useAuth } from './hooks/useAuth.js';
import { authService } from './services/auth.js';
import { interviewService } from './services/interviews.js';
import { openaiService } from './services/openai.js';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [stage, setStage] = useState('job-input');
  const [jobTitle, setJobTitle] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [questions, setQuestions] = useState([]);

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      let result;
      if (authMode === 'signup') {
        result = await authService.signUp(authEmail, authPassword);
      } else {
        result = await authService.signIn(authEmail, authPassword);
      }

      if (result.error) {
        setAuthError(result.error);
      } else {
        setShowAuthModal(false);
        setAuthEmail('');
        setAuthPassword('');
        if (authMode === 'signup') {
          alert('Please check your email to verify your account!');
        }
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setStage('job-input');
    setJobTitle('');
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setCurrentSession(null);
    setQuestions([]);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limits
    if (profile) {
      const usage = await interviewService.getMonthlyUsage(profile);
      if (usage.used >= usage.limit) {
        alert(`You've reached your monthly limit of ${usage.limit} interviews. Upgrade your plan for more interviews!`);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Create interview session
      const session = await interviewService.createSession(user.id, jobTitle);
      setCurrentSession(session);

      // Generate questions
      const generatedQuestions = await openaiService.generateQuestions(
        jobTitle, 
        null, 
        null, 
        profile?.subscription_tier || 'free'
      );
      
      setQuestions(generatedQuestions);
      setStage('interview');
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Error starting interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim()) return;

    setIsLoading(true);
    try {
      // Get AI feedback
      const feedbackResult = await openaiService.getFeedback(
        questions[currentQuestion].text,
        currentAnswer
      );

      const newAnswer = {
        question: questions[currentQuestion].text,
        answer: currentAnswer,
        score: feedbackResult.score,
        feedback: feedbackResult.feedback
      };

      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);

      // Update session in database
      if (currentSession) {
        await interviewService.updateSession(currentSession.id, {
          responses: newAnswers,
          questions: questions
        });
      }

      setCurrentAnswer('');

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Complete the session
        if (currentSession) {
          await interviewService.completeSession(currentSession.id);
        }
        setStage('results');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      alert('Error processing your answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startOver = () => {
    setStage('job-input');
    setJobTitle('');
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setIsLoading(false);
    setCurrentSession(null);
    setQuestions([]);
    setAuthError('');
  };

  const downloadPDF = () => {
    alert('🎉 Production Mode: PDF download would normally generate a comprehensive interview report with detailed feedback, improvement suggestions, and performance analytics. This feature is available in the full version of CoachIQ!');
  };

  // Show loading spinner while auth is initializing
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-white text-2xl font-bold drop-shadow-lg">Loading CoachIQ...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      {/* Tailwind Test Banner */}
      <div className="bg-red-500 text-white p-4 text-2xl font-bold text-center">
        🎨 Tailwind Test Banner - If you see this in RED, Tailwind is working!
      </div>
      
      {/* Tailwind Test Banner */}
      <div className="bg-red-500 text-white p-4 text-2xl font-bold text-center">
        🎨 Tailwind Test Banner - If you see this in RED, Tailwind is working!
      </div>
      
      {/* Tailwind Test Banner */}
      <div className="bg-red-500 text-white p-4 text-2xl font-bold text-center">
        🎨 Tailwind Test Banner - If you see this in RED, Tailwind is working!
      </div>
      
      {/* Tailwind Test Banner */}
      <div className="bg-red-500 text-white p-4 text-2xl font-bold text-center">
        🎨 Tailwind Test Banner - If you see this in RED, Tailwind is working!
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={startOver} className="flex items-center space-x-4 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CoachIQ</h1>
                <p className="text-sm text-gray-500 font-medium">AI-Powered Interview Coaching</p>
              </div>
            </button>
            <div className="flex items-center gap-6">
              <div className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-sm font-semibold rounded-full border border-amber-200 shadow-md">
                ✨ Demo Mode
              </div>
              {user ? (
                <div className="flex items-center gap-6">
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-200 shadow-md">
                    {profile?.subscription_tier || 'free'} Plan
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Job Input Stage */}
        {stage === 'job-input' && (
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-8 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30">
                    <Briefcase className="w-20 h-20 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
                What position are you interviewing for?
              </h2>
              <p className="text-xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                Enter your target job title and we'll generate personalized interview questions to help you practice and improve.
              </p>
            </div>

            <form onSubmit={handleJobSubmit} className="mb-16">
              <div className="flex gap-6 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="flex-1 px-8 py-5 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-white/20 focus:border-white/50 text-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-4 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 text-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-7 h-7" />
                  )}
                  {isLoading ? 'Starting...' : 'Start Interview'}
                </button>
              </div>
            </form>

            <div className="mb-16">
              <p className="text-xl font-semibold text-white/90 mb-8 drop-shadow-md">✨ Popular job titles:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager', 'Sales Representative'].map((job) => (
                  <button
                    key={job}
                    onClick={() => setJobTitle(job)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 hover:text-white transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>

            {/* Production Features */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Star className="w-8 h-8 text-yellow-300 animate-bounce" />
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Production Features</h3>
                <Star className="w-8 h-8 text-yellow-300 animate-bounce" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-400/20 border border-green-300/30 backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-green-300" />
                  <span className="font-semibold text-lg">Real Supabase authentication</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-400/20 border border-green-300/30 backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-green-300" />
                  <span className="font-semibold text-lg">Live Stripe payment processing</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-400/20 border border-green-300/30 backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-green-300" />
                  <span className="font-semibold text-lg">Database-backed interview sessions</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-400/20 border border-green-300/30 backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-green-300" />
                  <span className="font-semibold text-lg">AI-powered feedback system</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Stage */}
        {stage === 'interview' && (
          <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white drop-shadow-md">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-xl text-yellow-300 font-bold drop-shadow-md">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4 shadow-inner backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 mb-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex-shrink-0 shadow-xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-md">
                    Interview Question #{currentQuestion + 1}
                  </h3>
                  <p className="text-white text-2xl leading-relaxed drop-shadow-sm">
                    {questions[currentQuestion]?.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
              <form onSubmit={handleAnswerSubmit} className="space-y-8">
                <div>
                  <label className="block text-xl font-bold text-white mb-6 drop-shadow-md">
                    Your Answer
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Take your time to provide a thoughtful response. Consider using the STAR method: Situation, Task, Action, Result..."
                    rows={10}
                    className="w-full px-8 py-6 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-white/20 focus:border-white/50 resize-none text-lg leading-relaxed shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentAnswer.trim() || isLoading}
                    className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 flex items-center gap-4 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none text-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Getting AI Feedback...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        Submit Answer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-8 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30">
                    <Trophy className="w-20 h-20 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce" />
                  </div>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
                Interview Complete! 🎉
              </h2>
              <p className="text-2xl text-white/90 mb-12 drop-shadow-md">
                Great job completing your {jobTitle} interview practice
              </p>
              
              {/* Overall Score */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 mb-16 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                  <h3 className="text-3xl font-bold text-white drop-shadow-md">Overall Score</h3>
                </div>
                <div className="text-6xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                  {answers.length > 0 ? (answers.reduce((sum, a) => sum + a.score, 0) / answers.length).toFixed(1) : '0'}/10
                </div>
                <p className="text-xl text-white/90 drop-shadow-sm">Average across all questions</p>
              </div>
            </div>

            {/* Questions and Responses */}
            <div className="space-y-10 mb-16">
              <h3 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">Your Responses & Feedback</h3>
              
              {answers.map((answer, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-2xl font-bold text-white drop-shadow-md">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
                          {answer.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-white text-xl mb-8 leading-relaxed drop-shadow-sm">{answer.question}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h5 className="font-bold text-white mb-4 text-xl drop-shadow-sm">Your Answer:</h5>
                    <p className="text-gray-700 bg-white/90 p-6 rounded-2xl leading-relaxed text-lg">{answer.answer}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-white mb-4 text-xl drop-shadow-sm">AI Feedback:</h5>
                    <p className="text-blue-900 bg-blue-100/90 p-6 rounded-2xl leading-relaxed border-l-4 border-blue-400 text-lg">{answer.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={downloadPDF}
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-4 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 text-xl"
              >
                <Download className="w-7 h-7" />
                Download PDF Report
              </button>
              
              <button
                onClick={startOver}
                className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center gap-4 font-bold shadow-xl hover:shadow-2xl border-2 border-white/30 hover:border-white/50 transform hover:scale-105 text-xl"
              >
                <RotateCcw className="w-7 h-7" />
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300">
            <div className="p-10 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {authMode === 'signup' ? 'Sign up for CoachIQ' : 'Sign in to your account'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAuthModal(false)} 
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-3xl font-bold text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-10">
              {authError && (
                <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 text-lg">{authError}</p>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-8">
                <div>
                  <label className="block font-bold text-gray-800 mb-4 text-lg">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-4 text-lg">
                    Password
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none text-xl"
                >
                  {isLoading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-gray-600 text-lg">
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                    className="ml-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                  >
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-md">CoachIQ</h3>
                <p className="text-white/90 text-lg drop-shadow-sm">AI-Powered Interview Coaching</p>
              </div>
            </div>

            <div className="flex items-center space-x-8 mb-6 md:mb-0">
              <button className="text-white/90 hover:text-white font-semibold transition-colors drop-shadow-sm">
                About Us
              </button>
              <button className="text-white/90 hover:text-white font-semibold transition-colors drop-shadow-sm">
                Terms
              </button>
              <button className="text-white/90 hover:text-white font-semibold transition-colors drop-shadow-sm">
                Privacy
              </button>
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/90 text-lg drop-shadow-sm">
                © 2025 CoachIQ. Built with ❤️ for job seekers worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}