import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, AlertCircle, X, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export const LoginModal = () => {
    const { loginEmail, loginPassword, showLoginModal, authError, setLoginEmail, setLoginPassword, setShowLoginModal, setAuthError, handleLogin, handleRegister } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!showLoginModal)
        return null;
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setIsSubmitting(true);
        if (isSignUp) {
            if (!fullName || !signupEmail || !signupPassword) {
                setAuthError('Please fill in all signup fields.');
                setIsSubmitting(false);
                return;
            }
            const success = await handleRegister(fullName, signupEmail, signupPassword);
            if (success) {
                setFullName('');
                setSignupEmail('');
                setSignupPassword('');
            }
        }
        else {
            await handleLogin(null);
        }
        setIsSubmitting(false);
    };
    const toggleMode = (signupMode) => {
        setIsSignUp(signupMode);
        setAuthError('');
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white p-6 max-w-md w-full rounded-xl shadow-xl border border-slate-200 flex flex-col space-y-5", children: [_jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-slate-100", children: [_jsxs("h3", { className: "font-bold text-slate-800 flex items-center space-x-2", children: [isSignUp ? (_jsx(UserPlus, { className: "h-5 w-5 text-brand-600" })) : (_jsx(User, { className: "h-5 w-5 text-brand-600" })), _jsx("span", { children: isSignUp ? 'Create New Account' : 'Sign In to Your Profile' })] }), _jsx("button", { onClick: () => setShowLoginModal(false), className: "text-slate-400 hover:text-slate-650 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("div", { className: "flex bg-slate-100 p-1 rounded-lg", children: [_jsx("button", { type: "button", onClick: () => toggleMode(false), className: `flex-1 py-1.5 rounded-md text-xs font-semibold transition ${!isSignUp
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'}`, children: "Sign In" }), _jsx("button", { type: "button", onClick: () => toggleMode(true), className: `flex-1 py-1.5 rounded-md text-xs font-semibold transition ${isSignUp
                                ? 'bg-brand-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'}`, children: "Sign Up" })] }), _jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-4", children: [isSignUp && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-slate-500", children: "Full Name" }), _jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500", placeholder: "e.g. Jane Doe", required: true })] })), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-slate-500", children: "Email Address" }), _jsx("input", { type: "email", value: isSignUp ? signupEmail : loginEmail, onChange: (e) => isSignUp ? setSignupEmail(e.target.value) : setLoginEmail(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500", placeholder: "e.g. john@example.com", required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-slate-500", children: "Account Password" }), _jsx("input", { type: "password", value: isSignUp ? signupPassword : loginPassword, onChange: (e) => isSignUp ? setSignupPassword(e.target.value) : setLoginPassword(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), authError && (_jsxs("div", { className: "text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded flex items-center space-x-1.5 font-medium", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-red-650" }), _jsx("span", { children: authError })] })), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-sm transition disabled:opacity-60", children: isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In' })] }), !isSignUp && (_jsxs("div", { className: "text-[10px] text-slate-500 border-t border-slate-100 pt-3 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl", children: [_jsx("p", { className: "font-semibold text-slate-650", children: "Demo Credentials:" }), _jsxs("ul", { className: "list-disc pl-4 space-y-1 mt-1 text-slate-500", children: [_jsxs("li", { children: ["Email: ", _jsx("code", { className: "text-brand-600 font-bold", children: "john@example.com" })] }), _jsxs("li", { children: ["Password: ", _jsx("code", { className: "text-brand-600 font-bold", children: "Password@123" })] })] })] }))] }) }));
};
//# sourceMappingURL=LoginModal.js.map