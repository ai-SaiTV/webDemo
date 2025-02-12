<template>
    <el-progress
      v-if="isProcessing"
      :percentage="progress"
      :stroke-width="8"
      :color="gradientColor"
      :status="progressStatus"
    />
  </template>
  
  <script setup>
  const props = defineProps({
    isProcessing: Boolean,
    progress: Number,
    progressStatus: String,
    gradientColor: String,
  });
  </script>