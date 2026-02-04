/**
 * Custom Animation Hooks
 * 
 * Reusable hooks for common animation patterns.
 * Optimized for performance and respects reduced motion.
 */

import { useEffect, useState, useRef } from 'react';
import { useReducedMotion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/**
 * Hook to detect if element is in viewport with optional animation trigger
 */
export const useInViewAnimation = (options = {}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: '-100px',
        ...options,
    });

    return { ref, isInView };
};

/**
 * Hook for parallax scrolling effect
 */
export const useParallax = (distance = 100) => {
    const prefersReducedMotion = useReducedMotion();
    const { scrollY } = useScroll();

    const y = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : distance]);

    return y;
};

/**
 * Hook for smooth spring animation on value changes
 */
export const useSmoothValue = (value, config = {}) => {
    const spring = useSpring(value, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
        ...config,
    });

    return spring;
};

/**
 * Hook for mouse position relative to element
 */
export const useMousePosition = (ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        element.addEventListener('mousemove', handleMouseMove);
        return () => element.removeEventListener('mousemove', handleMouseMove);
    }, [ref]);

    return position;
};

/**
 * Hook for scroll progress within an element
 */
export const useScrollProgress = (ref) => {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    return scrollYProgress;
};

/**
 * Hook to determine if animations should be reduced
 */
export const usePrefersReducedMotion = () => {
    const prefersReducedMotion = useReducedMotion();
    return prefersReducedMotion;
};

/**
 * Hook for staggered children animations
 */
export const useStaggerChildren = (count, delay = 0.1) => {
    return Array.from({ length: count }, (_, i) => ({
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                delay: i * delay,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }));
};

/**
 * Hook for hover animation states
 */
export const useHoverAnimation = () => {
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const handlers = {
        onMouseEnter: () => !prefersReducedMotion && setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return { isHovered, handlers };
};

/**
 * Hook for window scroll position
 */
export const useWindowScroll = () => {
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition({
                x: window.scrollX,
                y: window.scrollY,
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollPosition;
};

/**
 * Hook for element size
 */
export const useElementSize = (ref) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [ref]);

    return size;
};

export default {
    useInViewAnimation,
    useParallax,
    useSmoothValue,
    useMousePosition,
    useScrollProgress,
    usePrefersReducedMotion,
    useStaggerChildren,
    useHoverAnimation,
    useWindowScroll,
    useElementSize,
};
