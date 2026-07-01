import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../toast/ToastContext';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authError, setAuthError] = useState('');
    const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
    // Load user session from local storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            }
            catch (err) {
                console.error('Failed to parse stored user details:', err);
            }
        }
    }, []);
    // Update Axios Authorization header and register global 401 interceptor
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        else {
            delete axios.defaults.headers.common['Authorization'];
        }
        const interceptor = axios.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                // Automatically clear stale local session on unauthorized status
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setShowLoginModal(true);
                showToast('Session expired. Please sign in again.', 'info');
            }
            return Promise.reject(error);
        });
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [token, showToast]);
    const handleLogin = async (e) => {
        if (e)
            e.preventDefault();
        setAuthError('');
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email: loginEmail || 'john@example.com',
                password: loginPassword || 'Password@123'
            });
            if (res.data.success) {
                const loggedUser = res.data.data.user;
                const loggedToken = res.data.data.accessToken;
                setUser(loggedUser);
                setToken(loggedToken);
                localStorage.setItem('token', loggedToken);
                localStorage.setItem('user', JSON.stringify(loggedUser));
                // Reset login form states
                setLoginEmail('');
                setLoginPassword('');
                setShowLoginModal(false);
                showToast(`Welcome back, ${loggedUser.fullName}!`, 'success');
            }
        }
        catch (err) {
            const errMsg = err.response?.data?.message || 'Login credentials invalid';
            setAuthError(errMsg);
            showToast(errMsg, 'error');
        }
    };
    const handleRegister = async (fullName, email, password) => {
        setAuthError('');
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, {
                fullName,
                email,
                password
            });
            if (res.data.success) {
                // Automatically login user after successful signup
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email,
                    password
                });
                if (loginRes.data.success) {
                    const loggedUser = loginRes.data.data.user;
                    const loggedToken = loginRes.data.data.accessToken;
                    setUser(loggedUser);
                    setToken(loggedToken);
                    localStorage.setItem('token', loggedToken);
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    setLoginEmail('');
                    setLoginPassword('');
                    setShowLoginModal(false);
                    showToast(`Account created! Welcome, ${fullName}.`, 'success');
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            const errMsg = err.response?.data?.message ||
                (err.response?.data?.errors && err.response.data.errors[0]?.message) ||
                'Registration failed';
            setAuthError(errMsg);
            showToast(errMsg, 'error');
            return false;
        }
    };
    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/auth/logout`);
        }
        catch (err) {
            console.error('API logout request failed, clearing local session anyway:', err);
        }
        finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showToast('Logged out successfully.', 'success');
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            token,
            loginEmail,
            loginPassword,
            showLoginModal,
            authError,
            setLoginEmail,
            setLoginPassword,
            setShowLoginModal,
            setAuthError,
            handleLogin,
            handleRegister,
            handleLogout,
            setUser
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map