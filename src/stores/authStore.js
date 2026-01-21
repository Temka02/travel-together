import { defineStore } from 'pinia';

const API_URL = 'http://localhost:3001/api';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    fullName: (state) => 
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userId: (state) => state.user?._id
  },

  actions: {
    saveAuthData(accessToken, refreshToken, user) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.user = user;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuthData() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    async refreshAccessToken() {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка обновления токена');
        }
        
        if (data.success) {
          this.accessToken = data.accessToken;
          localStorage.setItem('accessToken', data.accessToken);
          return data.accessToken;
        }
      } catch (error) {
        console.error('Refresh token error:', error);
        if (error.message.includes('истек') || error.message.includes('не найден')) {
          this.clearAuthData();
        }
        throw error;
      }
    },

    async fetchWithAuth(url, options = {}) {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }
      
      let response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
      });
      
      if (response.status === 401 && this.refreshToken) {
        try {
          const newAccessToken = await this.refreshAccessToken();
          
          headers.Authorization = `Bearer ${newAccessToken}`;
          response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers
          });
        } catch (refreshError) {
          this.clearAuthData();
          throw refreshError;
        }
      }
      
      return response;
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка регистрации');
        }
        
        if (data.success) {
          this.saveAuthData(data.accessToken, data.refreshToken, data.user);
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Неверный email или пароль');
        }
        
        if (data.success) {
          this.saveAuthData(data.accessToken, data.refreshToken, data.user);
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: this.refreshToken })
          });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.clearAuthData();
      }
    },

    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.fetchWithAuth('/auth/me');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки данных');
        }
        
        if (data.success) {
          this.user = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.fetchWithAuth('/auth/update-profile', {
          method: 'PUT',
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка обновления профиля');
        }
        
        if (data.success) {
          this.user = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});