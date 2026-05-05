import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { AIChatBot } from '@/components/AIChatBot';

// Eagerly loaded (above-the-fold/landing experience)
import Home from '@/pages/Home';
import Login from '@/pages/Login';

const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));

// Lazily loaded routes for code-splitting
const Register = lazy(() => import('@/pages/Register'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'));
const ItineraryPlanner = lazy(() => import('@/pages/ItineraryPlanner'));
const MyBookings = lazy(() => import('@/pages/MyBookings'));
const MyItineraries = lazy(() => import('@/pages/MyItineraries'));
const MyReviews = lazy(() => import('@/pages/MyReviews'));
const Profile = lazy(() => import('@/pages/Profile'));
const Payment = lazy(() => import('@/pages/Payment'));
const AIRecommendations = lazy(() => import('@/pages/AIRecommendations'));
const Reports = lazy(() => import('@/pages/Reports'));
const Billing = lazy(() => import('@/pages/Billing'));

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminDestinations = lazy(() => import('@/pages/admin/Destinations'));
const AdminBookings = lazy(() => import('@/pages/admin/Bookings'));
const AdminPayments = lazy(() => import('@/pages/admin/Payments'));
const AdminReviews = lazy(() => import('@/pages/admin/Reviews'));
const AdminReports = lazy(() => import('@/pages/admin/Reports'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = ['user', 'admin'] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
      <Route path="/destinations" element={<PublicLayout><Destinations /></PublicLayout>} />
      <Route path="/destinations/:id" element={<PublicLayout><DestinationDetail /></PublicLayout>} />

      {/* Protected User Routes */}
      <Route path="/itinerary-planner" element={
        <ProtectedRoute>
          <PublicLayout><ItineraryPlanner /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <PublicLayout><MyBookings /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-itineraries" element={
        <ProtectedRoute>
          <PublicLayout><MyItineraries /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-reviews" element={
        <ProtectedRoute>
          <PublicLayout><MyReviews /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <PublicLayout><Profile /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/payment/:bookingId" element={
        <ProtectedRoute>
          <PublicLayout><Payment /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/billing/:bookingId" element={
        <ProtectedRoute>
          <PublicLayout><Billing /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/ai-recommendations" element={
        <ProtectedRoute>
          <PublicLayout><AIRecommendations /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <PublicLayout><Reports /></PublicLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout><AdminUsers /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/destinations" element={
        <AdminRoute>
          <AdminLayout><AdminDestinations /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/bookings" element={
        <AdminRoute>
          <AdminLayout><AdminBookings /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/payments" element={
        <AdminRoute>
          <AdminLayout><AdminPayments /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/reviews" element={
        <AdminRoute>
          <AdminLayout><AdminReviews /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/reports" element={
        <AdminRoute>
          <AdminLayout><AdminReports /></AdminLayout>
        </AdminRoute>
      } />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <AIChatBot />
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
