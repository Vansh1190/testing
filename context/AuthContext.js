"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// 1. Create the authentication context
const AuthContext = createContext(null);

/**
 * Provides authentication state and functions to its children.
 * Manages user state, loading indicators, and error messages.
 * Handles login, registration, logout, and session persistence.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True initially to check for session
  const [error, setError] = useState(null);

  // Effect to check for a user session in localStorage on initial component mount
  useEffect(() => {
    console.log("AuthContext: Initializing and checking for user session in localStorage.");
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("AuthContext: User session restored from localStorage.", parsedUser);
      } else {
        console.log("AuthContext: No user session found in localStorage.");
      }
    } catch (err) {
      console.error("AuthContext: Failed to parse user data from localStorage. Clearing corrupted data.", err);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle user login
  const login = useCallback(async (email, password) => {
    console.log(`AuthContext: Attempting to log in user: ${email}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        console.log("AuthContext: Login successful.", data.data);
        return { success: true, data: data.data };
      } else {
        const errorMessage = data.error || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        console.error("AuthContext: Login failed.", errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'An unexpected network or server error occurred during login.';
      setError(errorMessage);
      console.error("AuthContext: Error during login fetch.", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle user registration
  const register = useCallback(async (email, password) => {
    console.log(`AuthContext: Attempting to register new user: ${email}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Automatically log in the user upon successful registration
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        console.log("AuthContext: Registration successful and user logged in.", data.data);
        return { success: true, data: data.data };
      } else {
        const errorMessage = data.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error("AuthContext: Registration failed.", errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'An unexpected network or server error occurred during registration.';
      setError(errorMessage);
      console.error("AuthContext: Error during registration fetch.", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle user logout
  const logout = useCallback(async () => {
    console.log("AuthContext: Logging out user.");
    setUser(null);
    localStorage.removeItem('user');
    // Optional: Call a backend endpoint to invalidate the session if needed.
    // This is good practice for security.
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        console.log("AuthContext: Logout signal sent to server.");
    } catch (err) {
        console.error("AuthContext: Failed to send logout signal to server. This is non-critical.", err);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
  }), [user, loading, error, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};