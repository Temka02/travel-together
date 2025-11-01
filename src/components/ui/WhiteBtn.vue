<template>
    <a class="white-btn">
        <slot></slot>
    </a>
</template>

<script>
export default {
    name: 'BlueBtn'
}
</script>

<style>
.white-btn{
    color: var(--primary);
    background: transparent;
    border: 2px solid var(--primary);
    padding: 0.75rem 1.5rem;
    border-radius: 14px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.white-btn:hover{
    transform: scale(101%, 101%);
}
</style>