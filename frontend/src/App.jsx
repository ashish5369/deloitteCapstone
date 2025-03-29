import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './components/AdminLayout';
import CustomerLayout from './components/CustomerLayout';
import VendorLayout from './components/VendorLayout';
import Dashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';
import Vendors from './pages/admin/Vendors';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';
import CustomerProfile from './pages/customer/Profile';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorEvents from './pages/vendor/Events';
import VendorProfile from './pages/vendor/Profile';
import VendorFinanace from './pages/vendor/Finance';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import useAuthStore from './store/authStore';

const queryClient = new QueryClient();

function App() {
  const { user } = useAuthStore();

  const getRedirectPath = (user) => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'vendor': return '/vendor';
      default: return '/dashboard';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <Router>
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to={getRedirectPath(user)} />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={getRedirectPath(user)} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={getRedirectPath(user)} />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />
            }>
              <Route index element={<Dashboard />} />
              <Route path="events/*" element={<Events />} />
              {/* <Route path="venues/*" element={<Venues />} /> */}
              <Route path="vendors/*" element={<Vendors />} />
            </Route>

            {/* Vendor Routes */}
            <Route path="/vendor" element={
              user?.role === 'vendor' ? <VendorLayout /> : <Navigate to="/login" />
            }>
              <Route index element={<VendorDashboard />} />
              <Route path="events/*" element={<VendorEvents />} />
              <Route path="profile" element={<VendorProfile />} />
              <Route path="finance" element={<VendorFinanace />} />

            </Route>

            {/* Customer Routes */}
            <Route path="/dashboard" element={
              user?.role === 'user' ? <CustomerLayout /> : <Navigate to="/login" />
            }>
              <Route index element={<CustomerDashboard />} />
              {/* <Route path="venues" element={<CustomerVenues />} /> */}
              <Route path="bookings" element={<CustomerBookings />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>
          </Routes>
        </Router>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App