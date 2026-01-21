<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1>Вход в аккаунт</h1>
      <p class="auth-subtitle">Войдите, чтобы присоединиться к путешествиям</p>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="form-content">
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
        <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" id="remember">
            <span class="checkmark"></span>
            Запомнить меня
          </label>
          <router-link to="/" class="forgot-password">Забыли пароль?</router-link>
        </div>
        <!-- Заменяем router-link на button для отправки формы -->
        <button type="submit" class="sign-in-btn" :disabled="loading">
          <BlueBtn>{{ loading ? 'Вход...' : 'Войти' }}</BlueBtn>
        </button>
      </form>
    </div>
    <div class="auth-switch">
      <span>Нет аккаунта?</span>
      <router-link to="/auth/register" class="switch-link">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script>
import BlueBtn from '@/components/ui/BlueBtn.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Login',
  components: {
    BlueBtn
  },
  
  data() {
    return {
      email: '',
      password: '',
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
    async handleLogin() {
      try {
        const authStore = useAuthStore();
        await authStore.login({
          email: this.email,
          password: this.password
        });
        
        this.$router.push('/');
      } catch (error) {
        console.error('Login error:', error);
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
.auth-container{
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 2.5rem 0;
  gap: 3rem;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.auth-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}
.form-group{
display: flex;
flex-direction: column;
gap: 0.5rem;
margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}
.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--white);
  transition: all 0.3s ease;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.checkbox input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox input:checked + .checkmark {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.forgot-password {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}
.auth-switch{
display: flex;
justify-content: center;
align-items: center;
gap: 0.5rem;
}
.switch-link{
color: var(--primary);
text-decoration: none;
font-size: 0.9rem;
font-weight: 700;
}
.sign-in-btn{
padding: 1.25rem 2rem;
font-size: 1.1rem;
font-weight: 700;
width: 100%;
background: none;
border: none;
cursor: pointer;
}

.sign-in-btn:disabled {
cursor: not-allowed;
opacity: 0.7;
}

.error-message {
background-color: #ffebee;
color: #c62828;
padding: 10px;
border-radius: 4px;
text-align: center;
margin-bottom: 15px;
}
</style>