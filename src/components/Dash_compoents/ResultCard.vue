<template>
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
</template>

<script setup>
import { progressProps } from 'element-plus';
import { defineProps } from 'vue';

const props = defineProps({
  generatedContent: {
    type: Object,
    required: true,
  },
});

const previewMindMap = () => {
  const mindMapWindow = window.open('', '_blank');
  if (mindMapWindow) {
    mindMapWindow.document.write(`
      <html>
        <head>
          <title>思维导图预览</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f2f5; }
            img { max-width: 90%; max-height: 90vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${props.generatedContent.mindMap.preview}" alt="思维导图">
        </body>
      </html>
    `);
  }
};




</script>

<style scoped lang="scss">
@import "./Dashstyle.css";
</style>