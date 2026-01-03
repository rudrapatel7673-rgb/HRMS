import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hrms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      localStorage.setItem('hrms_user', JSON.stringify(userWithoutPass));
      return { success: true };
    }

    // Check for admin/demo credentials if no users exist
    if (email === 'admin@hrms.com' && password === 'admin123') {
      const adminUser = { id: 'admin1', name: 'Admin User', email: 'admin@hrms.com', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('hrms_user', JSON.stringify(adminUser));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');

    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = { ...userData, id: Date.now().toString(), role: 'employee' }; // Default to employee
    users.push(newUser);
    localStorage.setItem('hrms_users', JSON.stringify(users));

    // Auto login after signup
    const { password, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    localStorage.setItem('hrms_user', JSON.stringify(userWithoutPass));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
