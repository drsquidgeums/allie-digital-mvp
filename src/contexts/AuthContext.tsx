import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscriptionStatus: SubscriptionData | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  subscriptionStatus: null,
  isLoading: true,
  signOut: async () => {},
  refreshSubscription: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkSubscription = async (currentSession: Session | null) => {
    if (!currentSession) {
      setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
      } else {
        setSubscriptionStatus(data);
      }
    } catch (err) {
      console.error('Error invoking check-subscription:', err);
      setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
    }
  };

  const refreshSubscription = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    await checkSubscription(currentSession);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer subscription check to avoid blocking auth state updates
        if (currentSession?.user) {
          setTimeout(() => {
            checkSubscription(currentSession);
          }, 0);
        } else {
          setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkSubscription(currentSession).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscriptionStatus(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, subscriptionStatus, isLoading, signOut, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
