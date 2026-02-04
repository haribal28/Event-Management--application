/**
 * AnimatedInput Component
 * 
 * Premium text input with animated focus glow and floating label.
 * Includes success/error state animations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedInput.css';

const AnimatedInput = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    success,
    icon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const isFloating = isFocused || hasValue;

    // Label animation
    const labelVariants = {
        default: {
            y: 0,
            scale: 1,
            color: '#64748b',
        },
        floating: {
            y: -24,
            scale: 0.85,
            color: error ? '#ef4444' : success ? '#22c55e' : '#8b5cf6',
        },
    };

    // Error message animation
    const errorVariants = {
        initial: { opacity: 0, y: -8, height: 0 },
        animate: {
            opacity: 1,
            y: 0,
            height: 'auto',
            transition: { duration: 0.2 }
        },
        exit: {
            opacity: 0,
            y: -8,
            height: 0,
            transition: { duration: 0.15 }
        },
    };

    // Status icon animation
    const iconVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 500, damping: 25 }
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.15 }
        },
    };

    return (
        <div className={`animated-input-wrapper ${className}`}>
            <div
                className={`
          animated-input-container
          ${isFocused ? 'focused' : ''}
          ${error ? 'error' : ''}
          ${success ? 'success' : ''}
          ${disabled ? 'disabled' : ''}
        `}
            >
                {/* Leading icon */}
                {icon && (
                    <span className="input-leading-icon">
                        {icon}
                    </span>
                )}

                {/* Input field */}
                <div className="input-field-wrapper">
                    {label && (
                        <motion.label
                            className="input-floating-label"
                            variants={labelVariants}
                            initial="default"
                            animate={isFloating ? 'floating' : 'default'}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {label}
                            {required && <span className="required-asterisk">*</span>}
                        </motion.label>
                    )}

                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={isFloating ? placeholder : ''}
                        disabled={disabled}
                        className="animated-input-field"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                </div>

                {/* Status icons */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.span
                            key="error"
                            className="input-status-icon error"
                            variants={iconVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </motion.span>
                    )}
                    {success && !error && (
                        <motion.span
                            key="success"
                            className="input-status-icon success"
                            variants={iconVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Focus glow effect */}
                <div className="input-glow" />
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && typeof error === 'string' && (
                    <motion.p
                        className="input-error-message"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedInput;
