<template>

  <template v-if="!showResult">
    <!-- 标题界面展示 -->
    <PlanHeader />
    <!-- 进度条动画 -->
    <StepProgress :isProcessing="isProcessing" :progress="progress" :gradientColor="gradientColor"
      :progressStatus="progressStatus" />

    <el-steps :active="activeStep" finish-status="success" process-status="process" class="custom-steps">
      <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description" />
    </el-steps>


    <!-- 大纲生成具体步骤 -->
    <div class="step-content">
      <StepForm :activeStep="activeStep" :form="form" :form1="form1" :Mindimgsrc="Mindimgsrc" :isZoomed="isZoomed"
        :imageStyle="imageStyle" :endWaitingTime="waitingTime" :translateY="translateY"
        @update:showResult="updateShowResult" @update:isZoomed="updateIsZoomed" @update:translateY="updateTranslateY" />
    </div>


    <div class="step-actions">
      <!-- "点击上一步"事件 -->
      <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
      <!-- "点击下一步"事件 -->
      <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep" :loading="isProcessing"
        :disabled="isProcessing">
        {{ isProcessing ? '正在处理中...' : '下一步' }}
      </el-button>
    </div>
  </template>

  <!-- 生成结果展示 -->
  <template v-else>
    <ResultHeader :generatedContent="generatedContent" @update:showResult="updateShowResult" />

    <ResultCard :generatedContent="generatedContent"/>
  </template>

</template>

<script setup lang="ts">
import PlanHeader from './PlanHeader.vue';
import StepProgress from './StepProgress.vue';
import StepForm from './StepForm.vue';
import ResultHeader from './ResultHeader.vue';
import ResultCard from './ResultCard.vue';

import {
  activeStep, nextStep, prevStep, steps,
  updateIsZoomed, isZoomed,
  updateTranslateY, translateY,
  Mindimgsrc, imageStyle,
  showResult, updateShowResult,
  form, form1, progressStatus,
  isProcessing, progress,
  generatedContent, gradientColor, waitingTime
} from './DashCompoents';

</script>

<style scoped lang="scss">
@import "./Dashstyle.css";
</style>