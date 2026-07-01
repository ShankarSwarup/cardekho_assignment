import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authError, setAuthError] = useState('');
    const BASE_URL = '/api/v1';
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
            }
            return Promise.reject(error);
        });
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [token]);
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
            }
        }
        catch (err) {
            setAuthError(err.response?.data?.message || 'Login credentials invalid');
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