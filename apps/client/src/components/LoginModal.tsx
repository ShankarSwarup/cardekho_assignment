import React from 'react';
import { User, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginModal: React.FC = () => {
  const {
    loginEmail,
    loginPassword,
    showLoginModal,
    authError,
    setLoginEmail,
    setLoginPassword,
    setShowLoginModal,
    handleLogin
  } = useAuth();

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 max-w-md w-full rounded-xl shadow-xl border border-slate-200 flex flex-col space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <User className="h-5 w-5 text-brand-600" />
            <span>Sign In to Your Profile</span>
          </h3>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-slate-400 hover:text-slate-650 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Account Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="••••••••"
              required
            />
          </div>

          {authError && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded flex items-center space-x-1.5 font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-sm transition"
          >
            Sign In
          </button>
        </form>

        <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-4 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl">
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
      </div>
    </div>
  );
};
