import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:3001/api';

export const useApplicationStore = defineStore('applicationStore', {
  state: () => ({
    myApplications: [],
    tripApplications: { pending: [], rejected: [] },
    loading: false,
    error: null
  }),

  actions: {
    async applyForTrip(tripId, message = '') {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth('/applications', {
          method: 'POST',
          body: JSON.stringify({ tripId, message })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка подачи заявки');
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMyApplications() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth('/applications/my');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки заявок');
        }
        
        // Проверяем структуру данных
        console.log('Загруженные заявки:', data.data);
        this.myApplications = data.data || [];
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async acceptApplication(applicationId) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/applications/${applicationId}/accept`, {
          method: 'PUT'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка принятия заявки');
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async rejectApplication(applicationId) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/applications/${applicationId}/reject`, {
          method: 'PUT'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка отклонения заявки');
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