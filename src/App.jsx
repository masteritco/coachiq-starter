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

  const handleDocumentsSubmit = async (resume, jobDescription) => {
    setLoading(true);
    setResumeText(resume);
    setJobDescriptionText(jobDescription);

    try {
      // Create local session (no database storage)
      const newSession = await interviewService.createSession(user?.id || 'anonymous', jobTitle);
      setSession(newSession);

      // Generate questions using both resume and job description
      const subscriptionTier = profile?.subscription_tier || 'free';
      const generatedQuestions = await openaiService.generateQuestions(
        jobTitle, 
        resume, 
        jobDescription, 
        subscriptionTier
      );
      
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setResponses([]);
      setInterviewStartTime(new Date());
      setStage('interview');
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setLoading(true);

    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      // Get AI feedback
      const feedback = await openaiService.getFeedback(currentQuestion.text, answer);
      
      const newResponse = {
        question: currentQuestion.text,
        answer,
        feedback: feedback.feedback,
        score: feedback.score
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);

      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Increment usage count for plan limits (lightweight operation)
        if (user) {
          // Run in background, don't wait for it
          interviewService.incrementUsageCount(user.id).catch(err => 
            console.warn('Usage increment failed (non-critical):', err)
          );
        }
        
        // Create final session object
        const endTime = new Date();
        
        const finalSession = {
          id: session?.id || 'local',
          jobTitle,
          resumeText,
          questions: questions.map(q => ({ id: q.id, text: q.text, category: q.category })),
          responses: updatedResponses,
          startTime: interviewStartTime || new Date(),
          endTime: endTime
        };
        
        setSession(finalSession);
        setStage('results');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (session) {
      generatePDF(session);
    }
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
        
        {stage === 'resume-upload' && (
          <ResumeUpload
            jobTitle={jobTitle}
            onSubmit={handleDocumentsSubmit}
            isLoading={loading}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        )}
        
        {stage === 'interview' && questions.length > 0 && (
          loading ? (
            <LoadingSpinner message="Getting AI feedback on your answer..." />
          ) : (
            <InterviewQuestion
              question={questions[currentQuestionIndex].text}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onSubmit={handleAnswerSubmit}
              isLoading={loading}
            />
          )
        )}
        
        {stage === 'results' && session && (
          <ResultsSummary
            session={session}
            onDownloadPDF={handleDownloadPDF}
            onStartOver={handleStartOver}
          />
        )}
        
        {stage === 'payment-success' && (
          <PaymentSuccess onContinue={handleStartOver} />
        )}
        
        {stage === 'payment-cancelled' && (
          <PaymentCancelled 
            onRetry={() => setShowUpgradeModal(true)}
            onBack={handleStartOver}
          />
        )}
        
        {stage === 'about' && (
          <AboutUs onBack={handleStartOver} />
        )}
        
        {stage === 'terms' && (
          <TermsOfService onBack={handleStartOver} />
        )}
        
        {loading && stage === 'resume-upload' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
              <LoadingSpinner message="Generating personalized interview questions..." />
            </div>
          </div>
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
      
      <ContactSalesModal
        isOpen={showContactSalesModal}
        onClose={() => setShowContactSalesModal(false)}
      />
      
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      
      <UsageLimitModal
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        onUpgrade={() => {
          setShowUsageLimitModal(false);
          setShowUpgradeModal(true);
        }}
        message={usageLimitMessage}
      />
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ContactUs onBack={() => setShowContactModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}