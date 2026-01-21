<template>
    <nav class="nav-panel">
        <div class="nav-content">
            <div class="logo-panel">
                <router-link to="/trips/all-trips" class="logo">TravelTogether</router-link>
            </div>
            <div class="auth-btns" v-if="!isAuthenticated">
                <router-link to="/auth/login"><BlueBtn>Войти</BlueBtn></router-link>
                <router-link to="/auth/register"><WhiteBtn>Регистрация</WhiteBtn></router-link>
            </div>
            <div class="auth-btns" v-else>
                <router-link to="/profile" class="profile-btn"><WhiteBtn>Профиль</WhiteBtn></router-link>
            </div>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import BlueBtn from '../ui/BlueBtn.vue'
import WhiteBtn from '../ui/WhiteBtn.vue'
export default {
    name: 'Navigation',
    components: {
        BlueBtn,
        WhiteBtn
    },
    computed: {
        isAuthenticated() {
        const authStore = useAuthStore();
        return authStore.isAuthenticated;
        }
    },
    methods: {
        async loadInitialData() {
            if (this.isAuthenticated) {
                await authStore.fetchCurrentUser();
            }
        },
        async created() {
            await this.loadInitialData();
        }
    }
}
</script>

<style>
.logo{
    color: var(--primary);
    text-decoration: none;
    font-size: 1.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.5rem;

}
.logo::before{
    content: '✈️';
    font-size: 1.5rem;
}
.nav-panel{
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
}
.nav-content{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
}
.auth-btns{
    display: flex;
    gap: 1rem;
}

</style>