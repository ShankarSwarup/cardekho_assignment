import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        // Auto-remove toast after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx("div", { className: "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full", children: toasts.map((toast) => (_jsxs("div", { className: `flex items-start justify-between p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 animate-slide-in ${toast.type === 'success'
                        ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                        : toast.type === 'error'
                            ? 'bg-rose-50 border-rose-250 text-rose-800'
                            : 'bg-blue-50 border-blue-250 text-blue-800'}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [toast.type === 'success' && _jsx(CheckCircle, { className: "h-5 w-5 text-emerald-600 shrink-0" }), toast.type === 'error' && _jsx(AlertTriangle, { className: "h-5 w-5 text-rose-600 shrink-0" }), toast.type === 'info' && _jsx(Info, { className: "h-5 w-5 text-blue-600 shrink-0" }), _jsx("span", { className: "font-semibold", children: toast.message })] }), _jsx("button", { onClick: () => removeToast(toast.id), className: "text-slate-400 hover:text-slate-650 ml-3 shrink-0", children: _jsx(X, { className: "h-4 w-4" }) })] }, toast.id))) })] }));
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
//# sourceMappingURL=ToastContext.js.map