'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast, createToastHelpers } from '../hooks/useToast';
import { ToastContainer } from '../ui/Toast';

interface ToastContextType {
  showToast: ReturnType<typeof useToast>['showToast'];
  dismissToast: ReturnType<typeof useToast>['dismissToast'];
  clearAllToasts: ReturnType<typeof useToast>['clearAllToasts'];
  toast: ReturnType<typeof createToastHelpers>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, showToast, dismissToast, clearAllToasts } = useToast();
  const toast = createToastHelpers(showToast);

  const contextValue: ToastContextType = {
    showToast,
    dismissToast,
    clearAllToasts,
    toast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}