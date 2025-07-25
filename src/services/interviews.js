import { supabase } from '../lib/supabase.js';

class InterviewService {
  async getMonthlyUsage(profile) {
    try {
      if (!profile?.id) {
        console.warn('No profile provided for usage check');
        return { used: 0, limit: 4, resetDate: new Date() };
      }

      // Get current month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('completed', true)
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        console.error('Error fetching usage:', error);
        // Return safe defaults on error
        return { used: 0, limit: 4, resetDate: new Date() };
      }

      const used = data?.length || 0;

      // Calculate limits based on subscription tier
      const limits = {
        free: 4,
        starter: 20,
        pro: 50,
        enterprise: 100
      };

      const limit = limits[profile.subscription_tier] || 4;

      // Calculate next reset date (first day of next month)
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);
      resetDate.setHours(0, 0, 0, 0);

      console.log(`📊 Usage for ${profile.email}: ${used}/${limit} interviews this month`);

      return { used, limit, resetDate };

    } catch (error) {
      console.error('Error getting monthly usage:', error);
      return { used: 0, limit: 4, resetDate: new Date() };
    }
  }

  async createSession(userId, jobTitle, resumeText = null, jobDescriptionText = null) {
    try {
      console.log('📝 Creating interview session for user:', userId);

      const sessionData = {
        user_id: userId,
        job_title: jobTitle,
        job_role_id: jobTitle.toLowerCase().replace(/\s+/g, '-'),
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
        questions: [],
        responses: [],
        completed: false,
        start_time: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      console.log('✅ Interview session created:', data.id);
      return data;

    } catch (error) {
      console.error('Error creating interview session:', error);
      throw error;
    }
  }

  async updateSession(sessionId, updates) {
    try {
      console.log('📝 Updating interview session:', sessionId);

      const { data, error } = await supabase
        .from('interview_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating session:', error);
        throw error;
      }

      console.log('✅ Interview session updated:', sessionId);
      return data;

    } catch (error) {
      console.error('Error updating interview session:', error);
      throw error;
    }
  }

  async completeSession(sessionId) {
    try {
      console.log('✅ Completing interview session:', sessionId);

      const { data, error } = await supabase
        .from('interview_sessions')
        .update({
          completed: true,
          end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error completing session:', error);
        throw error;
      }

      console.log('✅ Interview session completed:', sessionId);
      return data;

    } catch (error) {
      console.error('Error completing interview session:', error);
      throw error;
    }
  }

  async getUserSessions(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async getSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  async incrementUsageCount(userId) {
    // This is handled automatically when we mark a session as completed
    console.log('📊 Usage will be incremented when session is completed for user:', userId);
  }
}

export const interviewService = new InterviewService();