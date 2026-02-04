/**
 * Main App Component
 * 
 * Root component with:
 * - React Router for navigation
 * - AnimatePresence for page transitions
 * - Auth context provider
 * - Protected routes for authenticated and admin pages
 * - Global providers (Toast, etc.)
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Styles
import './index.css';
import './App.css';

// Context
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

// Layout components
import Navbar from './components/layout/Navbar';
import FloatingBackground from './components/animations/FloatingBackground';

// Providers
import { ToastProvider } from './components/ui/Toast';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import CreateEvent from './pages/CreateEvent';
import Bookings from './pages/Bookings';

// Admin Pages
import { AdminDashboard, AdminEvents, AdminBookings } from './pages/admin';

// Animated Routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Require Admin Role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute adminOnly>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="app">
            {/* Floating background gradients */}
            <FloatingBackground />

            {/* Navigation */}
            <Navbar />

            {/* Main content with animated routes */}
            <main className="main-content">
              <AnimatedRoutes />
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
