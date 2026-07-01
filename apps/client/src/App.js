import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CarProvider, useCars } from './contexts/CarContext';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { BrowseCars } from './components/BrowseCars';
// Lazy loading views and modal overlays for optimized bundle splitting and caching
const Compare = React.lazy(() => import('./components/Compare').then((m) => ({ default: m.Compare })));
const Wishlist = React.lazy(() => import('./components/Wishlist').then((m) => ({ default: m.Wishlist })));
const CarDetailsModal = React.lazy(() => import('./components/CarDetailsModal').then((m) => ({ default: m.CarDetailsModal })));
const LoginModal = React.lazy(() => import('./components/LoginModal').then((m) => ({ default: m.LoginModal })));
const AppContent = () => {
    const { activeTab } = useCars();
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(Suspense, { fallback: _jsx("div", { className: "p-12 text-center text-slate-500 font-medium", children: "Loading panel..." }), children: [activeTab === 'home' && _jsx(Overview, {}), activeTab === 'search' && _jsx(BrowseCars, {}), activeTab === 'compare' && _jsx(Compare, {}), activeTab === 'wishlist' && _jsx(Wishlist, {})] }) }), _jsxs(Suspense, { fallback: null, children: [_jsx(CarDetailsModal, {}), _jsx(LoginModal, {})] })] }));
};
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(CarProvider, { children: _jsx(AppContent, {}) }) }));
}
//# sourceMappingURL=App.js.map