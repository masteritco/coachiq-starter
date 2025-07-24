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

  // Check URL parameters for payment status
  React.useEffect(() => {
    // Skip URL processing during hot reload in development
    if (process.env.NODE_ENV === 'development' && !window.location.search && !window.location.hash) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const success = urlParams.get('success');
    const cancelled = urlParams.get('cancelled');
    const plan = urlParams.get('plan');
    
    // Check for email verification parameters in both URL and hash
    const token_hash = urlParams.get('token_hash') || hashParams.get('token_hash');
    const token = urlParams.get('token') || hashParams.get('token');
    const access_token = urlParams.get('access_token') || hashParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    const type = urlParams.get('type') || hashParams.get('type');
    const code = urlParams.get('code') || hashParams.get('code');
    const error = urlParams.get('error') || hashParams.get('error');
    const error_description = urlParams.get('error_description') || hashParams.get('error_description');
    
    try {
      if (success === 'true') {
        // Update user subscription based on the plan parameter
        if (plan && user && (plan === 'starter' || plan === 'pro')) {
          try {
            authService.updateSubscription(plan).catch(err => {
              // Silently handle subscription update errors in development
              if (process.env.NODE_ENV === 'development') {
                console.log('🔧 Development mode: Mock subscription update');
              } else {
                console.error('Subscription update failed:', err);
              }
            });
          } catch (error) {
            // Prevent any errors from breaking the flow
            console.log('🔧 Development mode: Skipping subscription update');
          }
        }
        setStage('payment-success');
      } else if (cancelled === 'true') {
        setStage('payment-cancelled');
      } else if (error) {
        console.error('Email verification error:', error, error_description);
        alert(`Email verification failed: ${error_description || error}`);
      } else if (token && type === 'signup') {
        // Handle Supabase email verification with token parameter
        authService.verifyEmail(token).then(() => {
          alert('Email verified successfully! Welcome to CoachIQ.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch((error) => {
          console.error('Email verification failed:', error);
          alert('Email verification failed. Please try again or contact support.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      } else if (access_token && refresh_token) {
        // Handle direct token verification (new Supabase format)
        authService.verifyEmailFromUrl().then(() => {
          alert('Email verified successfully! Welcome to CoachIQ.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch((error) => {
          console.error('Token verification failed:', error);
          alert('Email verification failed. Please try clicking the link again or contact support.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      } else if (code) {
        // Handle code-based verification (newer Supabase format)
        authService.verifyEmailFromUrl().then(() => {
          alert('Email verified successfully! Welcome to CoachIQ.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch((error) => {
          console.error('Code verification failed:', error);
          alert('Email verification failed. Please try clicking the link again or contact support.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      } else if (token_hash && type === 'email') {
        // Handle email verification
        authService.verifyEmailFromUrl().then(() => {
          // Email verified successfully
          alert('Email verified successfully! You can now use CoachIQ.');
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch((error) => {
          console.error('Email verification failed:', error);
          alert('Email verification failed. Please try clicking the link again or contact support.');
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    } catch (error) {
      console.error('Error processing URL parameters:', error);
      // Only clear URL in production, not during development hot reload
      if (process.env.NODE_ENV !== 'development') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);

  // Listen for modal events from AuthModal
  React.useEffect(() => {
    const handleOpenPrivacyModal = () => {
      setShowPrivacyModal(true);
    };

    const handleOpenTermsModal = () => {
      setShowTermsModal(true);
    };

    window.addEventListener('openPrivacyModal', handleOpenPrivacyModal);
    window.addEventListener('openTermsModal', handleOpenTermsModal);
    return () => {
      window.removeEventListener('openPrivacyModal', handleOpenPrivacyModal);
      window.removeEventListener('openTermsModal', handleOpenTermsModal);
    };
  }, []);

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

      // No database storage - everything handled in memory

      // Check if we should generate a follow-up question (Pro plan only)
      const subscriptionTier = profile?.subscription_tier || 'free';
      let followUpQuestion = null;
      
      // Calculate current totals
      const currentFollowUps = updatedResponses.filter(r => r.isFollowUp).length;
      const totalQuestions = questions.length;
      const maxTotalQuestions = subscriptionTier === 'pro' ? 11 : 
                               subscriptionTier === 'enterprise' ? 13 : 
                               subscriptionTier === 'starter' ? 5 : 4;
      
      if (subscriptionTier === 'pro' && 
          totalQuestions < maxTotalQuestions && 
          !currentQuestion.id.startsWith('followup-') && // Don't create follow-ups for follow-ups
          currentFollowUps < 3) { // Max 3 follow-ups per interview
        try {
          followUpQuestion = await openaiService.generateFollowUp(currentQuestion.text, answer);
          if (followUpQuestion) {
            // Add follow-up to questions array
            const updatedQuestions = [...questions];
            updatedQuestions.splice(currentQuestionIndex + 1, 0, followUpQuestion);
            setQuestions(updatedQuestions);
            
            // Mark the response as having a follow-up
            newResponse.hasFollowUp = true;
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('⚠️ Error generating follow-up (non-critical):', error);
          }
        }
      }

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
        
        // Generate candidate questions for Pro+ users only
        let candidateQuestions = [];
        const subscriptionTier = profile?.subscription_tier || 'free';
        if (subscriptionTier === 'pro' || subscriptionTier === 'enterprise') {
          try {
            candidateQuestions = await openaiService.generateCandidateQuestions(
              jobTitle, 
              resumeText, 
              jobDescriptionText
            );
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error generating candidate questions:', error);
            }
            // Continue without candidate questions if generation fails
          }
        }
        
        const finalSession = {
          id: session?.id || 'local',
          jobTitle,
          resumeText,
          questions: questions.map(q => ({ id: q.id, text: q.text, category: q.category })),
          responses: updatedResponses,
          candidateQuestions,
          startTime: interviewStartTime || new Date(),
          endTime: endTime
        };
        
        setSession(finalSession);
        setStage('results');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('OpenAI') || error.message.includes('API')) {
          alert('AI service temporarily unavailable. Please try again in a moment.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          alert('Network error. Please check your connection and try again.');
        } else {
          alert(`Error: ${error.message}. Please try again.`);
        }
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
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
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleUpgrade = async (planId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Lazy load stripe service only when needed
      const { stripeService } = await import('./services/stripe');
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}?success=true`;
      const cancelUrl = `${baseUrl}?cancelled=true`;
      
      const { sessionId, url } = await stripeService.createCheckoutSession({
        planId,
        billingCycle: 'monthly',
        userId: user.id,
        userEmail: user.email,
        successUrl,
        cancelUrl
      });
      
      // Use the Stripe service to handle redirect properly
      if (url && !sessionId.startsWith('cs_test_')) {
        window.location.href = url;
      } else {
        // Handle mock sessions
        await stripeService.redirectToCheckout(sessionId);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // More user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Unable to start checkout process. This might be because:\n\n• Stripe is not configured yet\n• Network connection issue\n• Service temporarily unavailable\n\nError: ${errorMessage}\n\nPlease try again or contact support.`);
    }
  };

  const handleContactSales = () => {
    setShowContactSalesModal(true);
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
