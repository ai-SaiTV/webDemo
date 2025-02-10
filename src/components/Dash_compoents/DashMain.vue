<template>

<template v-if="!showResult">
            
  <PlanHeader />
  
  <StepProgress 
      :isProcessing="isProcessing"
      :progress="progress"
      :gradientColor="gradientColor"
      :progressStatus="progressStatus"
    />

  <el-steps :active="activeStep" finish-status="success" process-status="process" class="custom-steps">
    <el-step v-for="(step, index) in steps" :key="index" :title="step.title"
      :description="step.description" />
  </el-steps>
  


  <div class="step-content">
    <StepForm 
      :activeStep="activeStep" 
      :form="form" 
      :form1="form1" 
      :Mindimgsrc="Mindimgsrc" 
      :isZoomed="isZoomed" 
      :imageStyle="imageStyle"
      :endWaitingTime="waitingTime"
      @update:showResult="updateShowResult"
      @update:isZoomed="updateIsZoomed"
      @update:translateY="updateTranslateY"  />
  </div>

  <div class="step-actions">
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
  <div class="result-header">
    <h2>{{ generatedContent.lessonPlan.title }} - 教案生成结果</h2>
    <el-button @click="showResult = false">返回编辑</el-button>
  </div>

  <div class="result-content">
    <!-- 教案内容卡片 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>教学设计</h3>
              <el-button type="primary" link>查看详情</el-button>
            </div>
          </template>
          <div class="lesson-plan">
            <h4>教学目标</h4>
            <ul>
              <li v-for="(objective, index) in generatedContent.lessonPlan.objectives" :key="index">
                {{ objective }}
              </li>
            </ul>
            <h4>教学步骤</h4>
            <ol>
              <li v-for="(step, index) in generatedContent.lessonPlan.steps" :key="index">
                {{ step }}
              </li>
            </ol>
          </div>
        </el-card>
      </el-col>

      <!-- 思维导图卡片 -->
      <el-col :span="12">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>知识点思维导图</h3>
              <el-button type="primary" link @click="previewMindMap">查看大图</el-button>
            </div>
          </template>
          <div class="mind-map">
            <img :src="generatedContent.mindMap.preview" alt="思维导图" style="width: 100%; cursor: pointer"
              @click="previewMindMap">
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 推荐资源卡片 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>推荐教学资源</h3>
              <el-button type="primary" link>查看更多</el-button>
            </div>
          </template>
          <div class="resources">
            <el-row :gutter="20">
              <el-col v-for="(resource, index) in generatedContent.resources" :key="index" :span="12">
                <div class="resource-card">
                  <img :src="resource.preview" :alt="resource.title">
                  <div class="resource-info">
                    <h4>{{ resource.title }}</h4>
                    <el-tag size="small">{{ resource.type.toUpperCase() }}</el-tag>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <!-- 练习题卡片 -->
      <el-col :span="12">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>配套练习</h3>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <div class="exercises">
            <div v-for="(exercise, index) in generatedContent.exercises" :key="index" class="exercise-item">
              <div class="exercise-header">
                <h4>{{ exercise.title }}</h4>
                <el-tag size="small" :type="exercise.difficulty === '简单' ? 'success' : 'warning'">
                  {{ exercise.difficulty }}
                </el-tag>
              </div>
              <p class="exercise-preview">{{ exercise.preview }}</p>
              <div class="exercise-footer">
                <span>{{ exercise.count }}道题目</span>
                <el-button type="primary" link size="small">开始练习</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

</template>
  
<script setup lang="ts">

  import PlanHeader from './PlanHeader.vue';
  import StepProgress from './StepProgress.vue';
  import StepForm from './StepForm.vue';
  // import ResultHeader from './ResultHeader.vue';
  // import ResultCard from './ResultCard.vue';
  // import ExerciseCard from './ExerciseCard.vue';
  import {
  activeStep, nextStep, prevStep,updateIsZoomed,updateTranslateY,
  previewMindMap, showResult, updateShowResult,steps,
  form, form1, Mindimgsrc, progressStatus, imageStyle, 
  isProcessing, isZoomed,progress,
  generatedContent, gradientColor,waitingTime
} from './DashCompoents';
  
</script>
  
<style scoped lang="scss">
@import "./Dashstyle.css";
</style>