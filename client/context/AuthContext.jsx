/**
 * Authentication Context
 * Manages global auth state and provides auth functions
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      } catch (err) {
        // User not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const signup = async (email, password, name, monthlyBudgetLimit) => {
    try {
      setError(null);
      const response = await authAPI.signup(email, password, name, monthlyBudgetLimit);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateBudget = async (monthlyBudgetLimit) => {
    try {
      setError(null);
      const response = await authAPI.updateBudgetLimit(monthlyBudgetLimit);
      setUser(prev => ({
        ...prev,
        monthlyBudgetLimit: response.monthlyBudgetLimit,
      }));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserCurrency = async (currency) => {
    try {
      setError(null);
      const response = await authAPI.updateCurrency(currency);
      setUser(prev => ({
        ...prev,
        currency: response.currency,
        currencySymbol: response.currencySymbol,
      }));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateBudget,
    updateUserCurrency,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
