"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.js';
import { LogIn, UserPlus, Mail, Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const { user, login, register, loading: authLoading, error: authError } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("AuthPage: User is already logged in. Redirecting to /dashboard.");
      router.push('/dashboard');
    }
  }, [user, router]);

  // Clear form fields and errors when switching views
  const toggleView = () => {
    console.log("AuthPage: Toggling view.");
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setFormError(null);
    // Note: We don't clear authError as it's managed by AuthContext and will be cleared on the next API call.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`AuthPage: Handling form submission for ${isLoginView ? 'login' : 'register'}.`);
    setFormError(null);

    // Basic client-side validation
    if (!email || !password) {
      setFormError('Email and password are required.');
      console.error("AuthPage: Validation failed - Missing email or password.");
      return;
    }
    if (!isLoginView && password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      console.error("AuthPage: Validation failed - Password too short for registration.");
      return;
    }

    let result;
    if (isLoginView) {
      result = await login(email, password);
    } else {
      result = await register(email, password);
    }

    if (result.success) {
      console.log(`AuthPage: ${isLoginView ? 'Login' : 'Registration'} successful. Redirecting...`);
      // The useEffect hook will handle the redirect once the user state is updated.
    } else {
      // The authError from context will be displayed.
      console.log(`AuthPage: ${isLoginView ? 'Login' : 'Registration'} failed. Error will be displayed.`);
    }
  };

  // Don't render the form if we are redirecting
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-base-200">
        <div className="text-center p-8">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <h2 className="text-2xl font-semibold">Authentication Successful</h2>
            <p className="mt-2 text-base-content/70">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 bg-base-200/70" style={{backgroundImage: 'radial-gradient(circle, hsla(var(--p)/0.05) 0%, transparent 60%)'}}>
      <div className="w-full max-w-md mx-auto">
        <div className="card bg-base-100 shadow-2xl border border-base-300/20 transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-1">
          <div className="card-body p-8 md:p-10">
            <div className="text-center mb-6 transition-all duration-300">
              <h1 className="text-3xl font-bold text-primary">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h1>
              <p className="text-base-content/70 mt-2">{isLoginView ? 'Sign in to continue your session' : 'Join us and get started in seconds'}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {(formError || authError) && (
                <div role="alert" className="alert alert-error shadow-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{formError || authError}</span>
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-5 h-5 absolute left-3 text-base-content/40 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-10 focus:input-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative flex items-center">
                  <Key className="w-5 h-5 absolute left-3 text-base-content/40 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10 focus:input-primary transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isLoginView ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center btn btn-ghost btn-sm rounded-l-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="form-control pt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isLoginView ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      {isLoginView ? 'Sign In' : 'Create Account'}
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="divider my-6 text-sm text-base-content/60">OR</div>

            <p className="text-center text-sm">
              {isLoginView ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleView}
                className="link link-primary font-semibold ml-2 hover:link-secondary transition-colors"
              >
                {isLoginView ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}