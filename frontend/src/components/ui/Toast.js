/**
 * Toast Notification System
 * 
 * Animated toast notifications with slide-in/out effects.
 * Supports success, error, and warning types.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import './Toast.css';

// Context for toast notifications
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
    success: {
        icon: FiCheck,
        className: 'toast-success',
    },
    error: {
        icon: FiX,
        className: 'toast-error',
    },
    warning: {
        icon: FiAlertTriangle,
        className: 'toast-warning',
    },
    info: {
        icon: FiInfo,
        className: 'toast-info',
    },
};

// Single toast component
const Toast = ({ id, type, title, message, onClose }) => {
    const config = toastConfig[type] || toastConfig.info;
    const Icon = config.icon;

    return (
        <motion.div
            className={`toast ${config.className}`}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                }
            }}
            exit={{
                opacity: 0,
                x: 100,
                scale: 0.9,
                transition: { duration: 0.2 }
            }}
            layout
        >
            <div className="toast-icon">
                <Icon size={18} />
            </div>

            <div className="toast-content">
                {title && <p className="toast-title">{title}</p>}
                {message && <p className="toast-message">{message}</p>}
            </div>

            <button className="toast-close" onClick={() => onClose(id)}>
                <FiX size={16} />
            </button>

            {/* Auto-dismiss progress bar */}
            <motion.div
                className="toast-progress"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
            />
        </motion.div>
    );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();

        setToasts((prev) => [...prev, { id, type, title, message }]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Convenience methods
    const toast = {
        success: (title, message) => addToast({ type: 'success', title, message }),
        error: (title, message) => addToast({ type: 'error', title, message }),
        warning: (title, message) => addToast({ type: 'warning', title, message }),
        info: (title, message) => addToast({ type: 'info', title, message }),
        custom: addToast,
    };

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
