import { useState, useEffect } from 'react';
import { authService } from '../services/auth.js';

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
    console.log('🔧 useAuth hook mounting');
    
    const unsubscribe = authService.subscribe((newState) => {
      console.log('🔧 useAuth received state update:', { 
        user: newState.user?.email, 
        profile: newState.profile?.subscription_tier, 
        loading: newState.loading 
      });
      setAuthState(newState);
    });
    
    return unsubscribe;
  }, []);

  console.log('🔧 useAuth current state:', { 
    user: authState.user?.email, 
    profile: authState.profile?.subscription_tier, 
    loading: authState.loading 
  });

  return authState;
}