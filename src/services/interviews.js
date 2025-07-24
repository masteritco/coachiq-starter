// Mock interview service
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
      job_role_id: jobTitle.toLowerCase().replace(/\s+/g, '-'),
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

export const interviewService = new InterviewService();