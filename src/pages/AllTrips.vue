<template>
  <div class="all-trips-container">
    <div class="all-trips-header">
      <h1 class="header-title">
        <span>
          🔍 Результаты поиска
        </span>
      </h1>
      <p class="header-subtitle" v-if="loading">Загрузка...</p>
      <p class="header-subtitle" v-else>Найдено {{ trips.length }} поездок</p>
    </div>
    
    <section class="search-section">
      <div class="search-header">
        <h2>Найдите своё путешествие</h2>
        <button type="button" @click="showModal = true" class="filtersButton">Фильтры</button>
      </div>
      
      <form class="search-panel" @submit.prevent="handleSearch">
        <div class="search-item">
          <label for="direction">Куда хотите поехать?</label>
          <input 
            v-model="searchFilters.destination" 
            type="text" 
            id="direction" 
            placeholder="Например, Кавказ или Байкал"
          >
        </div>
        
        <div class="search-item">
          <label for="date">Дата начала</label>
          <input v-model="searchFilters.date" type="date" id="date">
        </div>
        
        <div class="search-item">
          <label for="budget">Бюджет</label>
          <select v-model="searchFilters.budget">
            <option value="">Любой бюджет</option>
            <option value="low">До 20 000₽</option>
            <option value="medium">20 000 - 50 000₽</option>
            <option value="high">От 50 000₽</option>
          </select>
        </div>
        
        <button type="submit" style="border: 0;"><BlueBtn class="search-button">Найти</BlueBtn></button>
      </form>
    </section>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="!loading && !error" class="all-trips-main">
      <div v-if="trips.length === 0" class="no-trips">
        <p>Поездки не найдены. Попробуйте изменить параметры поиска.</p>
      </div>

      <TripCard
        v-else
        v-for="trip in trips"
        :key="trip._id"
        :trip="trip"
      />
    </div>
    
    <div class="all-trips-actions">
      <h4>Не нашли подходящего путешествия? Создайте свое!</h4>
      <BlueBtn 
        class="create-trip-button"
        @click="createTrip"
      >
        Создать путешествие
      </BlueBtn>
    </div>
  </div>
</template>

<script>
import { useTripStore } from '@/stores/tripStore';
import { useAuthStore } from '@/stores/authStore';
import BlueBtn from '@/components/ui/BlueBtn.vue';
import TripCard from '@/components/ui/TripCard.vue';

export default {
  name: 'AllTripsLayout',
  components: {
    TripCard,
    BlueBtn
  },
  
  data() {
    return {
      loading: false,
      showModal: false,
      searchFilters: {
        destination: '',
        date: '',
        budget: ''
      }
    };
  },
  
  setup() {
    const tripStore = useTripStore();
    const authStore = useAuthStore();
    return { tripStore, authStore };
  },
  
  computed: {
    trips() {
      return this.tripStore.trips;
    },
    
    error() {
      return this.tripStore.error;
    },
    
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    
    hasActiveSearch() {
      return this.searchFilters.destination || 
             this.searchFilters.date || 
             this.searchFilters.budget;
    }
  },
  
  created() {
    this.initFiltersFromQuery();
  },
  
  async mounted() {
    await this.loadTrips(this.getFiltersFromUrl());
  },
  
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.initFiltersFromQuery();
        this.loadTrips(this.getFiltersFromUrl());
      },
      deep: true
    }
  },
  
  methods: {
    initFiltersFromQuery() {
      const query = this.$route.query;
      this.searchFilters = {
        destination: query.destination || '',
        date: query.date || '',
        budget: query.budget || ''
      };
    },
    
    getFiltersFromUrl() {
      const query = this.$route.query;
      const priceFilters = this.getPriceFilters(query.budget);
      
      const filters = {
        destination: query.destination || '',
        startDate: query.date || '',
        ...priceFilters
      };
      
      Object.keys(filters).forEach(key => {
        if (!filters[key] && filters[key] !== 0) {
          delete filters[key];
        }
      });
      
      return filters;
    },
    
    getPriceFilters(budget) {
      switch(budget) {
        case 'low':
          return { maxPrice: 19999 };
        case 'medium':
          return { minPrice: 20000, maxPrice: 49999 };
        case 'high':
          return { minPrice: 50000 };
        default:
          return {};
      }
    },
    
    handleSearch() {
      const query = {};
      
      if (this.searchFilters.destination) {
        query.destination = this.searchFilters.destination;
      }
      
      if (this.searchFilters.date) {
        query.date = this.searchFilters.date;
      }
      
      if (this.searchFilters.budget) {
        query.budget = this.searchFilters.budget;
      }
      
      this.$router.push({
        path: this.$route.path,
        query: query
      });
    },
    
    async loadTrips(filters = {}) {
      this.loading = true;
      try {
        this.tripStore.error = null;
        await this.tripStore.fetchTrips(filters);
      } catch (error) {
        console.error('Ошибка загрузки поездок:', error);
      } finally {
        this.loading = false;
      }
    },
    
    createTrip() {
      if (this.isAuthenticated) {
        this.$router.push('/trips/create');
      } else {
        this.$router.push('/login');
      }
    }
  }
};
</script>
<style>
.all-trips-header{
  border-radius: 1.5rem;
  margin: 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem
}
.header-title span{
  color: var(--primary);
  font-weight: 900;
  font-size: 2.8rem;
  line-height: 1;
}
.header-subtitle{
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.5rem;
}
.all-trips-main{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
}
.all-trips-actions{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 4rem 0;
  text-align: center;
  align-items: center;
}
.all-trips-actions h4{
  color: var(--text-secondary);
  font-weight: 600;
}
.create-trip-button{
  max-width: 10rem;
}
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 20px 0;
  text-align: center;
}

.all-trips-main .no-trips {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
}
</style>