import React, { Suspense } from 'react';
import { AuthProvider } from './features/auth/AuthContext';
import { CarProvider, useCars } from './features/cars/CarContext';
import { ToastProvider } from './features/toast/ToastContext';
import { Header } from './components/Header';
import { Overview } from './features/cars/Overview';
import { BrowseCars } from './features/cars/BrowseCars';

// Lazy loading views and modal overlays for optimized bundle splitting and caching
const Compare = React.lazy(() =>
  import('./features/compare/Compare').then((m) => ({ default: m.Compare }))
);
const Wishlist = React.lazy(() =>
  import('./features/wishlist/Wishlist').then((m) => ({ default: m.Wishlist }))
);
const CarDetailsModal = React.lazy(() =>
  import('./features/cars/CarDetailsModal').then((m) => ({ default: m.CarDetailsModal }))
);
const LoginModal = React.lazy(() =>
  import('./features/auth/LoginModal').then((m) => ({ default: m.LoginModal }))
);

const AppContent: React.FC = () => {
  const { activeTab } = useCars();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Enterprise Header Bar */}
      <Header />

      {/* Main Workspace Frame with Suspense boundaries */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Loading panel...</div>}>
          {activeTab === 'home' && <Overview />}
          {activeTab === 'search' && <BrowseCars />}
          {activeTab === 'compare' && <Compare />}
          {activeTab === 'wishlist' && <Wishlist />}
        </Suspense>
      </main>

      {/* Overlays / Popups */}
      <Suspense fallback={null}>
        <CarDetailsModal />
        <LoginModal />
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CarProvider>
          <AppContent />
        </CarProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
