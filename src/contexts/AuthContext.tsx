import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  department: string;
  position: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  role: UserRole;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@dayflow.com',
    role: 'employee',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Software Developer',
    phone: '+1 234 567 8900',
    address: '123 Tech Street, San Francisco, CA',
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Sarah Admin',
    email: 'admin@dayflow.com',
    role: 'admin',
    employeeId: 'ADM001',
    department: 'Human Resources',
    position: 'HR Manager',
    phone: '+1 234 567 8901',
    address: '456 HR Avenue, San Francisco, CA',
    joinDate: '2022-01-10',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('dayflow_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      localStorage.setItem('dayflow_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      employeeId: data.employeeId,
      department: 'Pending Assignment',
      position: 'New Employee',
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    setUser(newUser);
    localStorage.setItem('dayflow_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
