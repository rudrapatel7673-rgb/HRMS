import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  department?: string;
  position?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  role: UserRole;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // If session exists, try to fetch profile
        // Don't await here to avoid blocking auth state change events
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      console.log('Fetching profile for:', userId);

      // Define internal fetch strategy with retries
      const attemptFetch = async () => {
        let finalProfile = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !finalProfile) {
          attempts++;
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();

            if (!error && data) {
              finalProfile = data;
              break;
            }
          } catch (err) {
            console.warn(`Profile fetch attempt ${attempts} failed:`, err);
          }

          // Wait before next attempt if not found (give trigger time)
          if (!finalProfile && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        return finalProfile;
      };

      // Race the fetch against a strict 4-second timeout
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timed out')), 4000)
      );

      let finalProfile: any = null;
      try {
        finalProfile = await Promise.race([attemptFetch(), timeout]);
      } catch (err) {
        console.warn('Profile fetch race completed with error/timeout:', err);
      }

      console.log('Fetch result:', finalProfile ? 'Found' : 'Not Found/Timed Out');

      // Fallback: Only create if retry loop failed completely
      if (!finalProfile) {
        console.warn('Profile not found for user after retries, attempting to create one...');

        // Attempt to get metadata from the auth user to respect signup choices
        const { data: authData } = await supabase.auth.getUser();
        const meta = authData.user?.user_metadata || {};

        const fallbackRole = meta.role || 'EMPLOYEE';
        const fallbackName = meta.name || 'User';
        const fallbackEmpId = meta.employee_id || 'EMP-' + Date.now();

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: email,
              name: fallbackName,
              employee_id: fallbackEmpId,
              role: fallbackRole
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Failed to create fallback profile:', createError);
        } else {
          console.log('Created fallback profile:', newProfile);
          finalProfile = newProfile;
        }
      }

      // Check if profile exists now
      if (finalProfile) {
        setUser({
          id: finalProfile.id,
          name: finalProfile.name || 'User',
          email: finalProfile.email || email,
          role: (finalProfile.role?.toLowerCase() as UserRole) || 'employee',
          employeeId: finalProfile.employee_id || 'EMP-000',
          department: finalProfile.department,
          position: finalProfile.position,
          phone: finalProfile.phone,
          address: finalProfile.address,
          joinDate: finalProfile.join_date,
          avatar: finalProfile.avatar_url,
        });
      } else {
        // Ultimate Fallback - Use metadata if available
        console.warn("Using minimal user data as profile load failed completely.");

        let fallbackRole: UserRole = 'employee';
        try {
          const { data: authData } = await supabase.auth.getUser();
          const metaRole = authData.user?.user_metadata?.role;
          if (metaRole) {
            fallbackRole = metaRole.toLowerCase() as UserRole;
          }
        } catch (e) {
          console.error('Error fetching metadata for fallback:', e);
        }

        setUser({
          id: userId,
          name: 'User',
          email: email,
          role: fallbackRole,
          employeeId: 'UNKNOWN',
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);

      let fallbackRole: UserRole = 'employee';
      try {
        const { data: authData } = await supabase.auth.getUser();
        const metaRole = authData.user?.user_metadata?.role;
        if (metaRole) {
          fallbackRole = metaRole.toLowerCase() as UserRole;
        }
      } catch (e) {
        console.error('Error fetching metadata for fallback (catch):', e);
      }

      // Even on error/timeout, we allow login with minimal data if we have the ID/email
      setUser({
        id: userId,
        name: 'User',
        email: email,
        role: fallbackRole,
        employeeId: 'UNKNOWN',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.session) {
        // Explicitly wait for profile fetch to complete
        await fetchProfile(data.session.user.id, data.session.user.email!);
      }

      return data.user;
    } catch (error) {
      console.error("Critical Login Error:", error);
      throw error;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            employee_id: data.employeeId,
            role: data.role.toUpperCase(),
          },
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
