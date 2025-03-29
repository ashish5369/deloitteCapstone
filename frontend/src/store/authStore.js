import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token, user } = response.data;
      set({ user, token, loading: false });
      localStorage.setItem('token', token);

      // Set default Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', credentials);
      const { token, user } = response.data;
      set({ user, token, loading: false });
      localStorage.setItem('token', token);

      // Set default Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  initialize: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        set({ user, token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  },

  isVendor: () => {
    const { user } = useAuthStore.getState();
    return user?.role === 'vendor';
  },

  isAdmin: () => {
    const { user } = useAuthStore.getState();
    return user?.role === 'admin';
  },
}));

export default useAuthStore;