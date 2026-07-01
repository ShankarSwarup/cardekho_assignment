import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../contexts/CarContext';

export const Header: React.FC = () => {
  const { user, handleLogout, setShowLoginModal } = useAuth();
  const { activeTab, setActiveTab, selectedForCompare, wishlistIds, triggerComparisonFetch } = useCars();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            AM
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900">AutoMatch</span>
            <span className="text-brand-600 font-semibold text-xs ml-1 px-1.5 py-0.5 rounded bg-brand-50">Pro</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'text-slate-900 bg-slate-100 border border-slate-200/40 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'text-slate-900 bg-slate-100 border border-slate-200/40 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Browse Cars
          </button>
          <button
            onClick={() => {
              if (selectedForCompare.length > 0) {
                triggerComparisonFetch();
              } else {
                setActiveTab('compare');
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'compare'
                ? 'text-slate-900 bg-slate-100 border border-slate-200/40 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Compare ({selectedForCompare.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
              activeTab === 'wishlist'
                ? 'text-slate-900 bg-slate-100 border border-slate-200/40 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Wishlist ({wishlistIds.length})</span>
          </button>
        </nav>

        {/* User Session Handler */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-sm text-slate-700 font-medium">Hi, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
