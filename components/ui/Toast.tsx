'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-success-500/10 border-success-500/30 text-success-400',
  error: 'bg-error-500/10 border-error-500/30 text-error-400',
  warning: 'bg-warning-500/10 border-warning-500/30 text-warning-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
        transition-all duration-300 ease-out max-w-sm
        ${toastStyles[type]}
        ${isVisible && !isExiting 
          ? 'opacity-100 translate-x-0 scale-100' 
          : isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-0 translate-x-full scale-95'
        }
      `}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl animate-progress" 
             style={{ animationDuration: `${duration}ms` }} />
      )}

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-medium text-white text-sm">{title}</h4>
            {message && (
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">{message}</p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-current/10 transition-colors"
            aria-label="Close notification"
          >
            <X size={14} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Container Component
export interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

// Custom CSS for progress animation
export const toastProgressCSS = `
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress linear forwards;
}
`;