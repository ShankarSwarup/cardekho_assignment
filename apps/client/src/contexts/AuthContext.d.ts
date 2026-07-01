import React from 'react';
interface AuthContextType {
    user: any;
    token: string | null;
    loginEmail: string;
    loginPassword: string;
    showLoginModal: boolean;
    authError: string;
    setLoginEmail: (email: string) => void;
    setLoginPassword: (password: string) => void;
    setShowLoginModal: (show: boolean) => void;
    setAuthError: (error: string) => void;
    handleLogin: (e: React.FormEvent | null) => Promise<void>;
    handleLogout: () => Promise<void>;
    setUser: (user: any) => void;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
