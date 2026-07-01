import React from 'react';
export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}
interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useToast: () => ToastContextType;
export {};
