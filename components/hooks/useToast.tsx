'use client';

import { useState, useCallback } from 'react';
import { ToastType, ToastProps } from '../ui/Toast';

interface UseToastReturn {
  toasts: (ToastProps & { id: string })[];
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const newToast = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      },
    };

    setToasts(prev => [...prev, newToast]);

    // Limit to 5 toasts max
    setToasts(prev => prev.slice(-5));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    dismissToast,
    clearAllToasts,
  };
}

// Helper functions for common toast types
export const createToastHelpers = (showToast: UseToastReturn['showToast']) => ({
  success: (title: string, message?: string) =>
    showToast({ type: 'success', title, message }),
  
  error: (title: string, message?: string) =>
    showToast({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) =>
    showToast({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) =>
    showToast({ type: 'info', title, message }),
});