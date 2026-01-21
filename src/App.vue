<template>
  <div id="app">
    <Navigation/>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navigation from './components/layout/Navigation.vue'
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'App',
  components: {
    Navigation
  },
  async created() {
    const authStore = useAuthStore();

    if (authStore.accessToken && !authStore.user) {
      try {
        await authStore.fetchCurrentUser();
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
  }
}
</script>

<style>
@import '@/styles/variables.css';
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
*{
  scroll-behavior: smooth;
  line-height: 1.6;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: var(--background);
  color: var(--text-primary);
}
.main-content{
  max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

@media (max-width: 768px) {
    .main-content{
        padding: 0 1rem;
    }
    .main-content .hero-section h1{
        font-size: 2.5rem;
    }
    .main-content .search-panel {
        grid-template-columns: 1fr;
    }
    
    .main-content .popular-trips-main{
        grid-template-columns: 1fr;
    }
    .tab-content .about-grid {
        grid-template-columns: 1fr;
    }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--background);
}

::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}
</style>

