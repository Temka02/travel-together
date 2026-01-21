<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Создать аккаунт</h1>
      <p class="auth-subtitle">Присоединяйтесь к сообществу путешественников</p>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleRegister" class="form-content">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Имя</label>
            <input 
              v-model="firstName" 
              type="text" 
              id="name" 
              placeholder="Ваше имя" 
              required
            >
          </div>
          <div class="form-group">
            <label for="surname">Фамилия</label>
            <input 
              v-model="lastName" 
              type="text" 
              id="surname" 
              placeholder="Ваша фамилия" 
              required
            >
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            placeholder="your-email@gmail.com" 
            required
          >
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            placeholder="Введите пароль" 
            required
          >
        </div>
        <div class="form-group">
          <label for="confirm-password">Подтвердите пароль</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            id="confirm-password" 
            placeholder="Введите пароль" 
            required
          >
        </div>
        <div class="form-options">
          <label class="checkbox">
            <input 
              type="checkbox" 
              id="remember" 
              v-model="agreeTerms"
            >
            <span class="checkmark"></span>
            Соглашаюсь с условиями пользования и политикой конфиденциальности
          </label>
        </div>
        <button 
          type="submit" 
          class="create-account-btn" 
          :disabled="loading || !agreeTerms"
        >
          <BlueBtn>{{ loading ? 'Создание...' : 'Создать аккаунт' }}</BlueBtn>
        </button>
      </form>
    </div>
    <div class="auth-switch">
      <span>Уже есть аккаунт?</span>
      <router-link to="/auth/login" class="switch-link">Войти</router-link>
    </div>
  </div>
</template>

<script>
import BlueBtn from '@/components/ui/BlueBtn.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Register',
  components: {
    BlueBtn
  },
  
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    };
  },
  
  computed: {
    loading() {
      const authStore = useAuthStore();
      return authStore.loading;
    },
    
    error() {
      const authStore = useAuthStore();
      return authStore.error;
    }
  },
  
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        const authStore = useAuthStore();
        authStore.error = 'Пароли не совпадают';
        return;
      }
      
      try {
        const authStore = useAuthStore();
        await authStore.register({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        });
        
        this.$router.push('/');
      } catch (error) {
        console.error('Register error:', error);
      }
    }
  },
  
  mounted() {
    const authStore = useAuthStore();
    authStore.clearError();
  }
}
</script>

<style>
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}
.create-account-btn{
  border: 0;
  padding: 1.25rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>