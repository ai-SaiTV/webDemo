<template>

  <h2>教案生成</h2>
  <p class="subtitle">智能分析教学需求，快速生成专业教案</p>


  <!-- 进度条 -->
  <StepProgress v-if="isProcessing" :progress="progress" :gradientColor="gradientColor"
    :progressStatus="progressStatus" />

  <!-- 步骤条 -->
  <el-steps :active="activeStep" finish-status="success" process-status="process" class="custom-steps">
    <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description" />
  </el-steps>

</template>

<script setup>
import { ref } from '@vue/runtime-core';
import StepProgress from './StepProgress.vue';

// 组件的属性
const showResult = ref(false); // 控制是否显示结果
const isProcessing = ref(false); // 控制是否显示进度条
const progress = ref(0); // 进度百分比
const progressStatus = ref("active"); // 进度条状态
const activeStep = ref(0); // 当前步骤
const gradientColor = computed(() => {
  const percentage = progress.value;

  const startColor = { r: 24, g: 144, b: 255 }; // 蓝色 rgb(24, 144, 255)
  const endColor = { r: 54, g: 207, b: 201 }; // 青色 rgb(54, 207, 201)

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percentage / 100));
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percentage / 100));
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percentage / 100));

  return `rgb(${r}, ${g}, ${b})`;
});

// 步骤数据
const steps = ref([
  { title: '大纲生成', description: '输入课程名称，自动生成大纲' },
  { title: '大纲修改', description: '调整和完善大纲内容' },
  { title: '教学要求', description: '添加教学需求，优化方案' },
  { title: '生成结果', description: '一键生成完整教案' }
]);
</script>

<style scoped>
.plan-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.main-card {
  padding: 1rem;
}
</style>