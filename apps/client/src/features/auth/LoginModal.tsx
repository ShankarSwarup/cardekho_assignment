import React, { useState } from 'react';
import { User, AlertCircle, X, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';

export const LoginModal: React.FC = () => {
  const {
    loginEmail,
    loginPassword,
    showLoginModal,
    authError,
    setLoginEmail,
    setLoginPassword,
    setShowLoginModal,
    setAuthError,
    handleLogin,
    handleRegister
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showLoginModal) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignUp) {
      if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
        setAuthError('All registration fields are required.');
        return;
      }
      if (fullName.trim().length < 2) {
        setAuthError('Full Name must be at least 2 characters.');
        return;
      }
      if (!emailRegex.test(signupEmail.trim())) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      if (signupPassword.length < 8) {
        setAuthError('Password must be at least 8 characters.');
        return;
      }

      setIsSubmitting(true);
      const success = await handleRegister(fullName.trim(), signupEmail.trim(), signupPassword);
      if (success) {
        setFullName('');
        setSignupEmail('');
        setSignupPassword('');
      }
    } else {
      if (!loginEmail.trim() || !loginPassword) {
        setAuthError('Email and Password are required.');
        return;
      }
      if (!emailRegex.test(loginEmail.trim())) {
        setAuthError('Please enter a valid email address.');
        return;
      }

      setIsSubmitting(true);
      await handleLogin(null);
    }
    setIsSubmitting(false);
  };

  const toggleMode = (signupMode: boolean) => {
    setIsSignUp(signupMode);
    setAuthError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 max-w-md w-full rounded-xl shadow-xl border border-slate-200 flex flex-col space-y-5">
        
        {/* Header Title */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            {isSignUp ? (
              <UserPlus className="h-5 w-5 text-brand-600" />
            ) : (
              <User className="h-5 w-5 text-brand-600" />
            )}
            <span>{isSignUp ? 'Create New Account' : 'Sign In to Your Profile'}</span>
          </h3>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-slate-400 hover:text-slate-650 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
              !isSignUp
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
              isSignUp
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500"
                placeholder="e.g. Jane Doe"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="email"
              value={isSignUp ? signupEmail : loginEmail}
              onChange={(e) => isSignUp ? setSignupEmail(e.target.value) : setLoginEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Account Password</label>
            <input
              type="password"
              value={isSignUp ? signupPassword : loginPassword}
              onChange={(e) => isSignUp ? setSignupPassword(e.target.value) : setLoginPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="••••••••"
              required
            />
          </div>

          {authError && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded flex items-center space-x-1.5 font-medium">
              <AlertCircle className="h-4 w-4 text-red-650" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-sm transition disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {!isSignUp && (
          <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-3 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl">
            <p className="font-semibold text-slate-650">Demo Credentials:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-500">
              <li>
                Email: <code className="text-brand-600 font-bold">john@example.com</code>
              </li>
              <li>
                Password: <code className="text-brand-600 font-bold">Password@123</code>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
