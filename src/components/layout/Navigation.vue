<template>
    <nav class="nav-panel">
        <div class="nav-content">
            <div class="logo-panel">
                <router-link to="/" class="logo">TravelTogether</router-link>
            </div>
            <div class="auth-btns">
                <BlueBtn>Войти</BlueBtn>
                <WhiteBtn>Регистрация</WhiteBtn>
            </div>
        </div>
    </nav>
</template>

<script>
import BlueBtn from '../ui/BlueBtn.vue'
import WhiteBtn from '../ui/WhiteBtn.vue'
export default {
    name: 'Navigation',
    components: {
        BlueBtn,
        WhiteBtn
    }
}
</script>

<style>
.logo{
    color: #2563eb;
    text-decoration: none;
    font-size: 1.8rem;
    font-weight: 900;
    line-height: 1.6;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: 0.05rem;

}
.logo::before{
    content: '✈️';
    font-size: 1.5rem;
}
.nav-panel{
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.nav-content{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.auth-btns{
    display: flex;
    gap: 1rem;
}

</style>