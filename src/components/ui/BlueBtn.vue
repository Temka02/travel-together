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
    box-sizing: border-box;
    background-image: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 14px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.blue-btn:hover {
    transform: scale(101%, 101%);
}
</style>