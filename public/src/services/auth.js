// Mock auth service for development
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

export const authService = new AuthService();
