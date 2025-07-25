import { supabase } from '../lib/supabase.js';

class AuthService {
  constructor() {
    this.currentState = {
      user: null,
      profile: null,
      loading: true
    };
    this.listeners = [];
    this.initialized = false;
    
    // Initialize auth state
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting initial session:', error);
        this.currentState = { user: null, profile: null, loading: false };
      } else if (session?.user) {
        // Load user profile
        const profile = await this.loadUserProfile(session.user.id);
        this.currentState = { 
          user: session.user, 
          profile, 
          loading: false 
        };
      } else {
        this.currentState = { user: null, profile: null, loading: false };
      }
      
      this.initialized = true;
      this.notifyListeners();
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const profile = await this.loadUserProfile(session.user.id);
          this.currentState = { 
            user: session.user, 
            profile, 
            loading: false 
          };
        } else {
          this.currentState = { user: null, profile: null, loading: false };
        }
        
        this.notifyListeners();
      });
      
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.currentState = { user: null, profile: null, loading: false };
      this.initialized = true;
      this.notifyListeners();
    }
  }

  async loadUserProfile(userId) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  getCurrentState() {
    return this.currentState;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    
    // If already initialized, call listener immediately
    if (this.initialized) {
      listener(this.currentState);
    }
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  async signUp(email, password) {
    try {
      console.log('🔐 Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error: error.message };
      }

      console.log('✅ Signup successful:', data.user?.email);
      
      // Note: User profile will be created automatically by database trigger
      return { user: data.user, error: null };
      
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      console.log('🔐 Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        return { user: null, error: error.message };
      }

      console.log('✅ Signin successful:', data.user?.email);
      
      // Profile will be loaded automatically by auth state change listener
      return { user: data.user, error: null };
      
    } catch (error) {
      console.error('Signin error:', error);
      return { user: null, error: error.message };
    }
  }

  async signOut() {
    try {
      console.log('🔐 Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Signout error:', error);
        return { error: error.message };
      }

      console.log('✅ Signout successful');
      
      // Clear local state
      this.currentState = { user: null, profile: null, loading: false };
      this.notifyListeners();
      
      return { error: null };
      
    } catch (error) {
      console.error('Signout error:', error);
      return { error: error.message };
    }
  }

  async updateSubscription(tier) {
    try {
      if (!this.currentState.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentState.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }

      // Update local state
      this.currentState.profile = data;
      this.notifyListeners();

      return { profile: data, error: null };
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { profile: null, error: error.message };
    }
  }

  async verifyEmail(token) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        console.error('Email verification error:', error);
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
      
    } catch (error) {
      console.error('Email verification error:', error);
      return { user: null, error: error.message };
    }
  }

  async verifyEmailFromUrl() {
    try {
      // This handles email verification from URL parameters
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session verification error:', error);
        return { user: null, error: error.message };
      }

      return { user: data.session?.user || null, error: null };
      
    } catch (error) {
      console.error('Session verification error:', error);
      return { user: null, error: error.message };
    }
  }

  async resendConfirmation(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        return { error: error.message };
      }

      return { error: null };
      
    } catch (error) {
      console.error('Resend confirmation error:', error);
      return { error: error.message };
    }
  }
}

export const authService = new AuthService();