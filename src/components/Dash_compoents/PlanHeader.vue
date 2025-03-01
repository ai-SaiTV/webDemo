<template>
  <div class="plan-header">
    <h2>{{ header }}</h2>
    <p class="subtitle">{{ subheader }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  header: {
    type: String,
    default: '教案生成',
  },
  subheader: {
    type: String,
    default: '智能分析教学需求，快速生成专业教案',
  },
  });
</script>
<style scoped lang="scss">
.plan-header {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px 8px 0 0;

  h2 {
    margin: 0;
    font-size: 1.75rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }
}
</style>