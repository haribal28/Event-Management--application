/**
 * AnimatedButton Component
 * 
 * Premium button with multiple animation effects:
 * - Hover glow animation
 * - Press (tap) scale-down effect
 * - Ripple effect on click
 * - Gradient sweep on hover
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useRef } from 'react';
import './AnimatedButton.css';

const AnimatedButton = ({
    children,
    variant = 'primary', // primary, secondary, ghost
    size = 'md', // sm, md, lg
    fullWidth = false,
    disabled = false,
    loading = false,
    icon = null,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const [ripples, setRipples] = useState([]);
    const buttonRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    // Create ripple effect on click
    const createRipple = (event) => {
        if (prefersReducedMotion || disabled) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
            id: Date.now(),
            x,
            y,
            size,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Clean up ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
    };

    const handleClick = (event) => {
        createRipple(event);
        if (onClick && !disabled && !loading) {
            onClick(event);
        }
    };

    // Animation variants
    const buttonVariants = {
        idle: { scale: 1 },
        hover: prefersReducedMotion ? {} : {
            scale: 1.02,
            y: -2,
        },
        tap: prefersReducedMotion ? {} : {
            scale: 0.98,
            y: 0,
        },
    };

    const sizeClasses = {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    };

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            className={`
        animated-btn
        btn-${variant}
        ${sizeClasses[size]}
        ${fullWidth ? 'btn-full' : ''}
        ${loading ? 'btn-loading' : ''}
        ${className}
      `}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {/* Gradient overlay for glow effect */}
            <span className="btn-glow" />

            {/* Gradient sweep effect */}
            <span className="btn-sweep" />

            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="btn-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            {/* Button content */}
            <span className="btn-content">
                {loading ? (
                    <span className="btn-spinner" />
                ) : (
                    <>
                        {icon && <span className="btn-icon">{icon}</span>}
                        {children}
                    </>
                )}
            </span>
        </motion.button>
    );
};

export default AnimatedButton;
