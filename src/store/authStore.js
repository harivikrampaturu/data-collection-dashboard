import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/authentication/login', credentials);
          const  user  = response.data.data;
          const token = response.data.token;

          debugger
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            loading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        
        // Remove token from axios headers
        delete api.defaults.headers.common['Authorization'];
      },

      // Validate token
      validateToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/v1/validate-token');
          
          if (response.data.message === 'Token is Valid') {
            set({ isAuthenticated: true, user: response.data.user });
            return true;
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          get().logout();
        }
        return false;
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
