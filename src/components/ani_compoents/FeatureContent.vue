<script setup lang="ts">
import { computed } from '@vue/runtime-core';

const props = defineProps<{
  title: string;
  subtitle: string;
  icon: any;
}>();

const Icon = computed(() => props.icon);
</script>

<template>
  <div class="feature-content">
    <div class="feature-icon">
      <component :is="Icon" />
    </div>
    <h1 class="main-title">{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
.feature-content {
  max-width: 800px;
  transition: all 0.5s ease;
  position: relative;
  z-index: 2;
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: white;
}

.main-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  transition: all 0.5s ease;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>