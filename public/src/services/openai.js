// Mock OpenAI service for development
class OpenAIService {
  async generateQuestions(jobTitle, resumeText, jobDescriptionText, subscriptionTier = 'free') {
    // Mock questions based on job title
    const mockQuestions = [
      { id: 'q1', text: `Tell me about your experience relevant to this ${jobTitle} position.`, category: 'behavioral' },
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
    // Mock feedback
    const score = Math.floor(Math.random() * 3) + 7; // Random score between 7-9
    const feedback = `Good response! You provided relevant information and showed understanding of the question. Consider adding more specific examples to strengthen your answer. Remember to use the STAR method (Situation, Task, Action, Result) for behavioral questions.`;
    
    return { feedback, score };
  }

  async generateFollowUp(originalQuestion, answer) {
    // Mock follow-up question
    return {
      id: `followup-${Date.now()}`,
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

export const openaiService = new OpenAIService();
