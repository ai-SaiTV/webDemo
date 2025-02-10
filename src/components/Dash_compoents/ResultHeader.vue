<template>
    <div class="result-header">
      <h2>{{ generatedContent.lessonPlan.title }} - 教案生成结果</h2>
      <el-button @click="showResult = false">返回编辑</el-button>
    </div>
  </template>
    <script setup>
    const props = defineProps({
      isProcessing: Boolean,
      progress: Number,
      progressStatus: String,
      gradientColor: String, // 接收动态渐变颜色
    });
    </script>