<template>
    <div class="health-check">
        <h1>Status: Operational</h1>
        <p>Сервер работает нормально</p>
        <p>Время проверки: {{ new Date().toLocaleString() }}</p>
    </div>
</template>

<script>
export default {
    name: 'HealthCheck'
}
</script>