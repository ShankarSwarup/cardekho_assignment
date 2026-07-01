import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AuthProvider } from './contexts/AuthContext';
import { CarProvider, useCars } from './contexts/CarContext';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { BrowseCars } from './components/BrowseCars';
import { Compare } from './components/Compare';
import { Wishlist } from './components/Wishlist';
import { CarDetailsModal } from './components/CarDetailsModal';
import { LoginModal } from './components/LoginModal';
const AppContent = () => {
    const { activeTab } = useCars();
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [activeTab === 'home' && _jsx(Overview, {}), activeTab === 'search' && _jsx(BrowseCars, {}), activeTab === 'compare' && _jsx(Compare, {}), activeTab === 'wishlist' && _jsx(Wishlist, {})] }), _jsx(CarDetailsModal, {}), _jsx(LoginModal, {})] }));
};
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(CarProvider, { children: _jsx(AppContent, {}) }) }));
}
//# sourceMappingURL=App.js.map