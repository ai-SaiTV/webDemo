<template>
  <div class="plan-header">
    <h2>教案生成</h2>
    <p class="subtitle">智能分析教学需求，快速生成专业教案</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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