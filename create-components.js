import fs from 'fs';
import path from 'path';

// Create directories if they don't exist
const servicesDir = 'src/services';
const hooksDir = 'src/hooks';

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// Service files content
const serviceFiles = {
  'auth.js': `// Mock auth service for development
class AuthService {
  constructor() {
    this.currentState = {
      user: null,
      profile: null,
      loading: false
    };
    this.listeners = [];
  }

  getCurrentState() {
    return this.currentState;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.currentState);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async signUp(email, password) {
    // Mock signup
    const mockUser = { id: 'mock-user', email };
    const mockProfile = { id: 'mock-user', email, subscription_tier: 'free' };
    
    this.currentState = { user: mockUser, profile: mockProfile, loading: false };
    this.listeners.forEach(listener => listener(this.currentState));
    
    return { user: mockUser, error: null };
  }

  async signIn(email, password) {
    // Mock signin
    const mockUser = { id: 'mock-user', email };
    const mockProfile = { id: 'mock-user', email, subscription_tier: 'free' };
    
    this.currentState = { user: mockUser, profile: mockProfile, loading: false };
    this.listeners.forEach(listener => listener(this.currentState));
    
    return { user: mockUser };
  }

  async signOut() {
    this.currentState = { user: null, profile: null, loading: false };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  async updateSubscription(tier) {
    if (this.currentState.profile) {
      this.currentState.profile.subscription_tier = tier;
      this.listeners.forEach(listener => listener(this.currentState));
    }
  }

  async verifyEmail(token) {
    return { user: this.currentState.user };
  }

  async verifyEmailFromUrl() {
    return { user: this.currentState.user };
  }

  async resendConfirmation(email) {
    return { error: null };
  }
}

export const authService = new AuthService();`,

  'openai.js': `// Mock OpenAI service for development
class OpenAIService {
  async generateQuestions(jobTitle, resumeText, jobDescriptionText, subscriptionTier = 'free') {
    // Mock questions based on job title
    const mockQuestions = [
      { id: 'q1', text: \`Tell me about your experience relevant to this \${jobTitle} position.\`, category: 'behavioral' },
      { id: 'q2', text: 'Describe a challenging project you worked on and how you overcame obstacles.', category: 'behavioral' },
      { id: 'q3', text: 'What interests you most about this role and our company?', category: 'behavioral' },
      { id: 'q4', text: 'How do you stay current with industry trends and best practices?', category: 'behavioral' }
    ];

    // Add more questions based on subscription tier
    if (subscriptionTier === 'starter') {
      mockQuestions.push({ id: 'q5', text: 'Describe your ideal work environment.', category: 'behavioral' });
    } else if (subscriptionTier === 'pro') {
      mockQuestions.push(
        { id: 'q5', text: 'Describe your ideal work environment.', category: 'behavioral' },
        { id: 'q6', text: 'Tell me about a time you had to learn something new quickly.', category: 'behavioral' },
        { id: 'q7', text: 'How do you handle tight deadlines and pressure?', category: 'behavioral' },
        { id: 'q8', text: 'What are your long-term career goals?', category: 'behavioral' }
      );
    }

    return mockQuestions;
  }

  async getFeedback(question, answer) {
    // Mock feedback with 2-second delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = Math.floor(Math.random() * 3) + 7; // Random score between 7-9
    const feedback = \`Good response! You provided relevant information and showed understanding of the question. Consider adding more specific examples to strengthen your answer. Remember to use the STAR method (Situation, Task, Action, Result) for behavioral questions.\`;
    
    return { feedback, score };
  }

  async generateFollowUp(originalQuestion, answer) {
    // Mock follow-up question
    return {
      id: \`followup-\${Date.now()}\`,
      text: "Can you tell me more about the specific challenges you faced in that situation?",
      category: 'behavioral',
      isFollowUp: true
    };
  }

  async generateCandidateQuestions(jobTitle, resumeText, jobDescriptionText) {
    // Mock candidate questions
    return [
      "What does success look like in this role after the first 90 days?",
      "How would you describe the team culture and collaboration style?",
      "What are the biggest challenges facing the team right now?",
      "What opportunities are there for professional development?",
      "How do you measure performance and provide feedback?",
      "What do you enjoy most about working here?"
    ];
  }
}

export const openaiService = new OpenAIService();`,

  'interviews.js': `// Mock interview service
class InterviewService {
  async getMonthlyUsage(profile) {
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const limits = {
      free: 4,
      starter: 20,
      pro: 50,
      enterprise: 100
    };
    
    const tier = profile?.subscription_tier || 'free';
    
    return {
      used: 0, // Mock: no usage yet
      limit: limits[tier],
      resetDate
    };
  }

  async createSession(userId, jobTitle) {
    return {
      id: 'mock-session-' + Date.now(),
      user_id: userId,
      job_title: jobTitle,
      job_role_id: jobTitle.toLowerCase().replace(/\\s+/g, '-'),
      questions: [],
      responses: [],
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async incrementUsageCount(userId) {
    // Mock: do nothing
    console.log('Mock: Incrementing usage for user', userId);
  }
}

export const interviewService = new InterviewService();`,

  'pdfGenerator.js': `// Mock PDF generator
export function generatePDF(session) {
  // Mock PDF generation
  alert('PDF generation is not available in demo mode. This would normally download a comprehensive interview report.');
  console.log('Mock PDF would contain:', session);
}`
};

// Hook files content
const hookFiles = {
  'useAuth.js': `import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export function useAuth() {
  const [authState, setAuthState] = useState(() => {
    try {
      return authService.getCurrentState();
    } catch (error) {
      console.error('Error getting initial auth state:', error);
      return { user: null, profile: null, loading: true };
    }
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 useAuth hook mounting');
    }
    const unsubscribe = authService.subscribe((newState) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 useAuth received state update:', { 
          user: newState.user?.email, 
          profile: newState.profile?.subscription_tier, 
          loading: newState.loading 
        });
      }
      setAuthState(newState);
    });
    
    return unsubscribe;
  }, []);

  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 useAuth current state:', { 
      user: authState.user?.email, 
      profile: authState.profile?.subscription_tier, 
      loading: authState.loading 
    });
  }

  return authState;
}`
};

// Create service files
Object.entries(serviceFiles).forEach(([filename, content]) => {
  const filePath = path.join(servicesDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${filePath}`);
});

// Create hook files
Object.entries(hookFiles).forEach(([filename, content]) => {
  const filePath = path.join(hooksDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${filePath}`);
});

console.log('\\n🎉 All service and hook files created successfully!');
console.log('📁 Services created in: src/services/');
console.log('📁 Hooks created in: src/hooks/');
console.log('\\n📋 Files created:');
console.log('Services:');
Object.keys(serviceFiles).forEach(filename => {
  console.log(`   - ${filename}`);
});
console.log('Hooks:');
Object.keys(hookFiles).forEach(filename => {
  console.log(`   - ${filename}`);
});