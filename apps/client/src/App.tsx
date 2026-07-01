import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CarProvider, useCars } from './contexts/CarContext';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { BrowseCars } from './components/BrowseCars';
import { Compare } from './components/Compare';
import { Wishlist } from './components/Wishlist';
import { CarDetailsModal } from './components/CarDetailsModal';
import { LoginModal } from './components/LoginModal';

const AppContent: React.FC = () => {
  const { activeTab } = useCars();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Enterprise Header Bar */}
      <Header />

      {/* Main Workspace Frame */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <Overview />}
        {activeTab === 'search' && <BrowseCars />}
        {activeTab === 'compare' && <Compare />}
        {activeTab === 'wishlist' && <Wishlist />}
      </main>

      {/* Overlays / Popups */}
      <CarDetailsModal />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <AppContent />
      </CarProvider>
    </AuthProvider>
  );
}
