
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the user types
type UserRole = 'local' | 'student' | 'admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPrime?: boolean;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to verify credentials
    try {
      setLoading(true);
      // Mock login - in a real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we're checking if email contains "student" to determine the role
      const role: UserRole = email.includes('student') ? 'student' : 'local';
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        role,
        isPrime: false,
        rating: role === 'student' ? 4.0 : undefined,
        reviewCount: role === 'student' ? 5 : undefined,
        verified: role === 'student' ? Math.random() > 0.5 : undefined,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true);
      // Mock registration - in a real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role,
        isPrime: false,
        rating: role === 'student' ? 4.0 : undefined,
        reviewCount: role === 'student' ? 0 : undefined,
        verified: role === 'student' ? false : undefined,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
