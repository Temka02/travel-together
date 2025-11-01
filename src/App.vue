<template>
  <div id="app">
    <Navigation/>
    <main class="main-content">
      <Home/>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navigation from './components/layout/Navigation.vue'
import Home from './pages/Home.vue';
export default {
  name: 'App',
  components: {
    Home,
    Navigation
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
*{
  scroll-behavior: smooth;
  line-height: 1.55;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>

