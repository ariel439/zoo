
import React, { useEffect } from 'react';
import { BackendError } from '../types/types';

interface ToastNotificationProps {
  message?: string; // Made optional
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
  backendError?: BackendError; // Added backendError prop
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose, duration = 5000, type = 'success', backendError }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const displayMessage = backendError ? `${backendError.error}: ${backendError.message}` : message;
  const notificationType = backendError && backendError.status >= 400 ? 'error' : type;

  const bgColor = notificationType === 'success' ? 'bg-green-600/90' : 'bg-red-600/90';
  const borderColor = notificationType === 'success' ? 'border-green-400/50' : 'border-red-400/50';
  const textColor = notificationType === 'success' ? 'text-green-200' : 'text-red-200';
  const iconColor = notificationType === 'success' ? 'currentColor' : 'currentColor';

  const icon = notificationType === 'success' ? (
    <svg className="w-6 h-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-6 h-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.24 1.943 3.24h14.714c1.638 0 2.809-1.74 1.943-3.24L12.982 5.573a1.125 1.125 0 00-1.964 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );

  return (
    <div className={`fixed bottom-5 right-5 z-50 ${bgColor} text-white py-3 px-6 rounded-lg shadow-lg flex items-center border ${borderColor}`} role="alert" aria-live="assertive">
      {icon}
      <span className="text-sm font-medium">{displayMessage}</span>
      <button onClick={onClose} className={`ml-4 -mr-2 p-1 ${textColor} rounded-full hover:text-white hover:bg-white/20 transition-colors`} aria-label="Fechar notificação">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;
