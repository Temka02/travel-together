import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

export const useTripStore = defineStore('tripStore', {
  state: () => ({
    trips: JSON.parse(localStorage.getItem('trips')) || [],
    currentTrip: JSON.parse(localStorage.getItem('currentTrip')) || null,
    loading: false,
    error: null
  }),

  getters: {
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('trips', JSON.stringify(this.trips));
      if (this.currentTrip) {
        localStorage.setItem('currentTrip', JSON.stringify(this.currentTrip));
      } else {
        localStorage.removeItem('currentTrip');
      }
    },

    clearLocalStorage() {
      localStorage.removeItem('trips');
      localStorage.removeItem('currentTrip');
    },

    async fetchTrips(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== '') {
            queryParams.append(key, filters[key]);
          }
        });
        
        const url = `/trips${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await authStore.fetchWithAuth(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки поездок');
        }
        
        this.trips = data.data || [];
        this.saveToLocalStorage();
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTripById(id) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/trips/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки поездки');
        }
        
        this.currentTrip = data.data;
        this.saveToLocalStorage();
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createTrip(tripData) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth('/trips', {
          method: 'POST',
          body: JSON.stringify(tripData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка создания поездки');
        }
        
        this.trips.unshift(data.data);
        this.saveToLocalStorage();
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTrip(id, tripData) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/trips/${id}`, {
          method: 'PUT',
          body: JSON.stringify(tripData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка обновления поездки');
        }
        
        const index = this.trips.findIndex(trip => trip._id === id);
        if (index !== -1) {
          this.trips[index] = data.data;
        }
        
        if (this.currentTrip && this.currentTrip._id === id) {
          this.currentTrip = data.data;
        }
        
        this.saveToLocalStorage();
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteTrip(id) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/trips/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка удаления поездки');
        }
        
        this.trips = this.trips.filter(trip => trip._id !== id);
        
        if (this.currentTrip && this.currentTrip._id === id) {
          this.currentTrip = null;
        }
        
        this.saveToLocalStorage();
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTripParticipants(id) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/trips/${id}/participants`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки участников');
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTripApplications(id) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchWithAuth(`/trips/${id}/applications`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки заявок');
        }
        
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentTrip() {
      this.currentTrip = null;
      localStorage.removeItem('currentTrip');
    },

    clearError() {
      this.error = null;
    }
  }
});