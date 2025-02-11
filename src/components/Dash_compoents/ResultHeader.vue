<template>
  <div class="result-header">
    <h2>{{ generatedContent.lessonPlan.title }} - 教案生成结果</h2>
    <el-button @click="handleBackToEdit">返回编辑</el-button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const emit = defineEmits([
  'update:showResult',
]);

const props = defineProps({
  generatedContent: {
    type: Object,
    required: true,
  },
});


const handleBackToEdit = () => {
  emit('update:showResult', false);
};
</script>

<style scoped lang="scss">
.result-header {
      background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        margin: 0;
        font-size: 1.75rem;
      }
    }
</style>