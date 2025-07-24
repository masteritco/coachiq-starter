import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create components directory if it doesn't exist
const componentsDir = path.join('src', 'components');
if (!fs.existsSync('src')) {
  fs.mkdirSync('src');
}
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Component files content
const components = {
  'ResumeUpload.jsx': `import React from 'react';
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
}`,

  'InterviewQuestion.jsx': `import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export default function InterviewQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onSubmit, 
  isLoading 
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: \`\${progress}%\` }}
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
              Interview Question #{questionNumber}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">{question}</p>
          </div>
        </div>
      </div>

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Take your time to provide a thoughtful response..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!answer.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Getting Feedback...
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
  );
}`,

  'ResultsSummary.jsx': `import React from 'react';
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
}`,

  'AuthModal.jsx': `import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Demo: \${mode} with \${email}\`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'signup' ? 'Sign up for CoachIQ' : 'Sign in to your account'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'UpgradeModal.jsx': `import React from 'react';
import { X, Crown } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
                <p className="text-gray-600 text-sm">Demo mode - upgrades not available</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            This is a demo version of CoachIQ. In the full version, you would be able to:
          </p>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Upload resumes for personalized questions</li>
            <li>• Get advanced AI feedback</li>
            <li>• Download PDF reports</li>
            <li>• Access premium features</li>
          </ul>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
}`,

  'UsageLimitModal.jsx': `import React from 'react';
import { X, Clock } from 'lucide-react';

export default function UsageLimitModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Usage Limit</h2>
                <p className="text-gray-600 text-sm">Demo mode</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
}`,

  'PaymentSuccess.jsx': `import React from 'react';
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
}`,

  'PaymentCancelled.jsx': `import React from 'react';
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
}`,

  'AboutUs.jsx': `import React from 'react';
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
}`,

  'PrivacyPolicyModal.jsx': `import React from 'react';
import { X, Shield } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-gray-600 text-sm">Demo version</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            This is a demo version of CoachIQ. In the full version, we take your privacy seriously 
            and do not store any personal data permanently.
          </p>
        </div>
      </div>
    </div>
  );
}`,

  'TermsOfService.jsx': `import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfService({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to CoachIQ
      </button>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 rounded-full">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-lg text-gray-600">Demo version</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-gray-700">
          This is a demo version of CoachIQ. The full version would include complete terms of service.
        </p>
      </div>
    </div>
  );
}`,

  'TermsOfServiceModal.jsx': `import React from 'react';
import { X, FileText } from 'lucide-react';

export default function TermsOfServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                <p className="text-gray-600 text-sm">Demo version</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            This is a demo version of CoachIQ. The full version would include complete terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}`,

  'Footer.jsx': `import React from 'react';
import { Shield, Mail, Heart } from 'lucide-react';

export default function Footer({ onPrivacyClick, onAboutClick, onTermsClick, onContactClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">CoachIQ</h3>
              <p className="text-sm text-gray-500">AI-Powered Interview Coaching</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <button onClick={onAboutClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              About Us
            </button>
            <button onClick={onTermsClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Terms
            </button>
            <button onClick={onPrivacyClick} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Privacy
            </button>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {currentYear} CoachIQ. Made with <Heart className="w-4 h-4 text-red-500" /> for job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}`,

  'ContactSalesModal.jsx': `import React from 'react';
import { X, Phone } from 'lucide-react';

export default function ContactSalesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Sales</h2>
                <p className="text-gray-600 text-sm">Demo mode</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            This is a demo version. In the full version, you could contact our sales team for enterprise pricing.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
}`,

  'ContactUs.jsx': `import React from 'react';
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
}`
};

// Create all component files
Object.entries(components).forEach(([filename, content]) => {
  const filePath = path.join(componentsDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${filePath}`);
});

console.log('\\n🎉 All component files created successfully!');
console.log('📁 Files created in: src/components/');
console.log('\\n📋 Files created:');
Object.keys(components).forEach(filename => {
  console.log(`   - ${filename}`);
});