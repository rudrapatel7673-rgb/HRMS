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
        await fetchProfile(session.user.id, session.user.email!);
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

      // Create a promise that rejects after 5 seconds to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
      );

      // Wrap Supabase calls
      const profilePromise = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) throw error;
        return data;
      };

      // Race against timeout
      const profile = await Promise.race([profilePromise(), timeoutPromise]) as any;
      console.log('Fetch result:', profile ? 'Found' : 'Not Found');

      let finalProfile = profile;

      // Fallback: If profile doesn't exist (e.g. trigger failed or manual insert), create it
      if (!finalProfile) {
        console.warn('Profile not found for user, attempting to create one...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: email,
              full_name: 'User',
              employee_id: 'EMP-' + Date.now(),
              role: 'EMPLOYEE'
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

      const { data: empProfile } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (finalProfile) {
        console.log('Profile loaded successfully:', finalProfile);
        setUser({
          id: finalProfile.id,
          name: finalProfile.full_name || 'User',
          email: finalProfile.email || email,
          role: (finalProfile.role as UserRole) || 'employee',
          employeeId: finalProfile.employee_id || 'EMP-000',
          department: empProfile?.department,
          position: empProfile?.designation,
          phone: empProfile?.phone,
          address: empProfile?.address,
          joinDate: empProfile?.join_date,
          avatar: empProfile?.profile_foto,
        });
      } else {
        console.warn("Using minimal user data as profile load failed completely.");
        setUser({
          id: userId,
          name: 'User',
          email: email,
          role: 'employee',
          employeeId: 'UNKNOWN',
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Even on error/timeout, we allow login with minimal data if we have the ID/email
      setUser({
        id: userId,
        name: 'User',
        email: email,
        role: 'employee',
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
            full_name: data.name,
            employee_id: data.employeeId,
            role: data.role,
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
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
