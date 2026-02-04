/**
 * Login Page
 * 
 * Premium login form with:
 * - Animated input fields
 * - Form validation with error animations
 * - Auth context integration
 * - Social login options
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedInput from '../components/ui/AnimatedInput';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Form animation variants
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, demoLogin, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Validation Error', 'Please fix the errors below');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Welcome back!', `Logged in as ${result.user.name}`);
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login Failed', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = async (role) => {
    setIsLoading(true);

    try {
      const result = await demoLogin(role);

      if (result.success) {
        toast.success('Demo Login', `Logged in as ${result.user.name}`);
        navigate(role === 'admin' ? '/admin' : '/');
      }
    } catch (error) {
      toast.error('Demo Login Failed', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-card"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="auth-header" variants={itemVariants}>
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div variants={itemVariants}>
              <AnimatedInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<FiMail />}
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<FiLock />}
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div className="auth-options" variants={itemVariants}>
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedButton
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                icon={<FiArrowRight />}
              >
                Sign In
              </AnimatedButton>
            </motion.div>
          </form>

          {/* Demo Login Buttons */}
          <motion.div className="demo-login" variants={itemVariants}>
            <p className="demo-label">Quick Demo Access:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn user"
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
              >
                Demo User
              </button>
              <button
                type="button"
                className="demo-btn admin"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
              >
                Demo Admin
              </button>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div className="auth-divider" variants={itemVariants}>
            <span>or continue with</span>
          </motion.div>

          {/* Social Login */}
          <motion.div className="social-login" variants={itemVariants}>
            <button type="button" className="social-btn google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button type="button" className="social-btn github">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p className="auth-footer" variants={itemVariants}>
            Don't have an account?{' '}
            <Link to="/register">Create account</Link>
          </motion.p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Login;
