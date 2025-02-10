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
@import "./Dashstyle.css";
</style>