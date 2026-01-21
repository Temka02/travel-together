<template>
    <div class="auth-layout">
      <router-view />
    </div>
</template>
  
<script>
export default {
    name: 'AuthLayout'
}
</script>

<style>
.auth-layout{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}
</style>