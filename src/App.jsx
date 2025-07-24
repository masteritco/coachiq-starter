import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { openaiService } from './services/openai';
import { interviewService } from './services/interviews';
import { authService } from './services/auth';
import { generatePDF } from './services/pdfGenerator';

// Components
import Header from './components/Header';
import JobTitleInput from './components/JobTitleInput';
import ResumeUpload from './components/ResumeUpload';
import InterviewQuestion from './components/InterviewQuestion';
import ResultsSummary from './components/ResultsSummary';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';
import UpgradeModal from './components/UpgradeModal';
import UsageLimitModal from './components/UsageLimitModal';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentCancelled from './components/PaymentCancelled';
import AboutUs from './components/AboutUs';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfService from './components/TermsOfService';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import Footer from './components/Footer';
import ContactSalesModal from './components/ContactSalesModal';
import ContactUs from './components/ContactUs';

export default function App() {
  const authState = useAuth();
  
  // Add safety check for auth state
  if (!authState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }
  
  const { user, profile, loading: authLoading } = authState;
  
  // App state
  const [stage, setStage] = useState('job-input');
  const [jobTitle, setJobTitle] = useState('');
  const [resumeText, setResumeText] = useState();
  const [jobDescriptionText, setJobDescriptionText] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviewStartTime, setInterviewStartTime] = useState(null);
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [usageLimitMessage, setUsageLimitMessage] = useState('');
  const [showContactSalesModal, setShowContactSalesModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleJobTitleSubmit = async (title) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check usage limits
    try {
      const usage = await interviewService.getMonthlyUsage(profile);
      if (usage.used >= usage.limit) {
        const daysUntilReset = Math.ceil((usage.resetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        setUsageLimitMessage(`You've reached your monthly limit of ${usage.limit} interviews. Your limit resets in ${daysUntilReset} days.`);
        setShowUsageLimitModal(true);
        return;
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    }

    setJobTitle(title);
    setStage('resume-upload');
  };

  const handleStartOver = () => {
    setStage('job-input');
    setJobTitle('');
    setResumeText(undefined);
    setJobDescriptionText(undefined);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setSession(null);
    setInterviewStartTime(null);
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setShowUpgradeModal(true)}
        onAboutClick={() => setStage('about')}
        onAuthClick={() => setShowAuthModal(true)}
        onHomeClick={handleStartOver}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stage === 'job-input' && (
          <JobTitleInput 
            onSubmit={handleJobTitleSubmit}
            isLoading={loading}
          />
        )}
        
        {stage === 'about' && (
          <AboutUs onBack={handleStartOver} />
        )}
      </main>

      {/* Footer - only show on main stages */}
      {(stage === 'job-input' || stage === 'resume-upload' || stage === 'results') && (
        <Footer 
          onPrivacyClick={() => setShowPrivacyModal(true)}
          onAboutClick={() => setStage('about')}
          onTermsClick={() => setStage('terms')}
          onContactClick={() => setShowContactModal(true)}
        />
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onContactSales={() => setShowContactSalesModal(true)}
        onSuccess={() => {
          setShowUpgradeModal(false);
          handleStartOver();
        }}
      />
    </div>
  );
}
