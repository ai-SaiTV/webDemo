<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="plan-header">
    <h2>{{ title }}</h2>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.plan-header {
  background: linear-gradient(135deg, #6629ff 0%, #a5c5ff 100%);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.plan-header h2 {
  margin: 0;
  font-size: 1.75rem;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}
</style>