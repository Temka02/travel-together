<template>
    <a class="blue-btn">
        <slot></slot>
    </a>
</template>

<script>
export default {
    name: 'BlueBtn'
}
</script>

<style>
.blue-btn{
    background: var(--gradient-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 14px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow);
}

.blue-btn:hover {
    transform: scale(101%, 101%);
}
</style>