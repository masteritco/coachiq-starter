import { supabase } from '../lib/supabase.js';

class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateQuestions(jobTitle, resumeText, jobDescriptionText, subscriptionTier = 'free') {
    try {
      // If no OpenAI API key, use fallback questions
      if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
        console.log('🤖 Using fallback questions (no OpenAI API key)');
        return this.getFallbackQuestions(jobTitle, subscriptionTier);
      }

      console.log('🤖 Generating AI questions for:', jobTitle);

      const questionCount = this.getQuestionCount(subscriptionTier);
      
      const prompt = this.buildQuestionsPrompt(jobTitle, resumeText, jobDescriptionText, questionCount);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach. Generate realistic, professional interview questions that would be asked for the given job position. Return only a JSON array of question objects with id, text, and category fields.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      const questions = JSON.parse(content);
      
      console.log('✅ Generated', questions.length, 'AI questions');
      return questions;

    } catch (error) {
      console.error('Error generating AI questions:', error);
      console.log('🤖 Falling back to default questions');
      return this.getFallbackQuestions(jobTitle, subscriptionTier);
    }
  }

  async getFeedback(question, answer) {
    try {
      // If no OpenAI API key, use fallback feedback
      if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
        console.log('🤖 Using fallback feedback (no OpenAI API key)');
        return this.getFallbackFeedback();
      }

      console.log('🤖 Getting AI feedback for answer');

      const prompt = `Please provide constructive feedback on this interview answer:

Question: ${question}
Answer: ${answer}

Provide:
1. A score from 1-10
2. Specific feedback on what was good
3. Specific suggestions for improvement
4. Overall assessment

Format your response as JSON with "score" (number) and "feedback" (string) fields.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach providing constructive feedback. Be encouraging but honest. Provide specific, actionable advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      const result = JSON.parse(content);
      
      console.log('✅ Generated AI feedback with score:', result.score);
      return result;

    } catch (error) {
      console.error('Error getting AI feedback:', error);
      console.log('🤖 Falling back to default feedback');
      return this.getFallbackFeedback();
    }
  }

  buildQuestionsPrompt(jobTitle, resumeText, jobDescriptionText, questionCount) {
    let prompt = `Generate ${questionCount} professional interview questions for a ${jobTitle} position.`;
    
    if (resumeText) {
      prompt += `\n\nCandidate's resume summary: ${resumeText.substring(0, 500)}`;
    }
    
    if (jobDescriptionText) {
      prompt += `\n\nJob description: ${jobDescriptionText.substring(0, 500)}`;
    }
    
    prompt += `\n\nReturn a JSON array of exactly ${questionCount} questions. Each question should have:
- id: unique identifier (q1, q2, etc.)
- text: the interview question
- category: "behavioral", "technical", or "situational"

Focus on realistic questions that would actually be asked in interviews.`;

    return prompt;
  }

  getQuestionCount(subscriptionTier) {
    const counts = {
      free: 4,
      starter: 5,
      pro: 8,
      enterprise: 10
    };
    return counts[subscriptionTier] || 4;
  }

  getFallbackQuestions(jobTitle, subscriptionTier) {
    const baseQuestions = [
      { id: 'q1', text: `Tell me about your experience relevant to this ${jobTitle} position.`, category: 'behavioral' },
      { id: 'q2', text: 'Describe a challenging project you worked on and how you overcame obstacles.', category: 'behavioral' },
      { id: 'q3', text: 'What interests you most about this role and our company?', category: 'behavioral' },
      { id: 'q4', text: 'How do you stay current with industry trends and best practices?', category: 'behavioral' }
    ];

    const additionalQuestions = [
      { id: 'q5', text: 'Describe your ideal work environment and team dynamics.', category: 'behavioral' },
      { id: 'q6', text: 'Tell me about a time you had to learn something new quickly.', category: 'situational' },
      { id: 'q7', text: 'How do you handle tight deadlines and pressure?', category: 'behavioral' },
      { id: 'q8', text: 'What are your long-term career goals?', category: 'behavioral' },
      { id: 'q9', text: 'Describe a time you disagreed with a team member. How did you handle it?', category: 'situational' },
      { id: 'q10', text: 'What would you do in your first 90 days in this role?', category: 'situational' }
    ];

    const questionCount = this.getQuestionCount(subscriptionTier);
    const allQuestions = [...baseQuestions, ...additionalQuestions];
    
    return allQuestions.slice(0, questionCount);
  }

  getFallbackFeedback() {
    const scores = [7, 8, 9];
    const score = scores[Math.floor(Math.random() * scores.length)];
    
    const feedbacks = [
      "Good response! You provided relevant information and showed understanding of the question. Consider adding more specific examples to strengthen your answer. Remember to use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
      "Excellent answer! You demonstrated strong communication skills and relevant experience. To further improve: (1) Add more quantifiable results, (2) Connect your experience directly to the role requirements, (3) Show enthusiasm for the opportunity.",
      "Strong response! You addressed the question well and provided good context. For even better answers: (1) Include specific metrics or outcomes, (2) Explain the impact of your actions, (3) Relate your experience to the company's needs."
    ];
    
    const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    
    return { score, feedback };
  }

  async generateFollowUp(originalQuestion, answer) {
    // Mock follow-up question for now
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