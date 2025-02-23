<template>
  <!-- 教案内容卡片 -->
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card class="result-card">
        <template #header>
          <div class="card-header">
            <el-button type="primary" link @click="initializeData">查看详情</el-button>
            <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="generatedContent.lessonPlan" class="markdown-content"></div>
            </div>
          </div>
        </template>
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
          <img :src="generatedContent.mindMap.preview" alt="思维导图"
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
            <h3>推荐教学视频</h3>
            <el-button type="primary" link>查看更多</el-button>
          </div>
        </template>
        <div class="resources">
          <el-row :gutter="20">
            <el-col v-for="(resource, index) in generatedContent.resources" :key="index" :span="12">
              <div class="resource-card">
                <div class="resource-info">
                  <a :href="resource.url" target="_blank" rel="noopener noreferrer">
                    <h4>{{ resource.title }}</h4>
                  </a>
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
            <el-button type="primary" link @click="showAllExercises = true">查看全部</el-button>
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
            <!-- <p class="exercise-preview">{{ exercise.preview }}</p> -->
            <div class="exercise-footer">
              <!-- <span>{{ exercise.count }}道题目</span> -->
              <a :href="exercise.preview" download="file.pdf">
                <el-button type="primary" link size="small">下载</el-button>
              </a>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 全部练习的覆盖层 -->
  <div v-if="showAllExercises" class="overlay" @click="showAllExercises = false">
    <div class="overlay-content" @click.stop>
      <!-- <div class="markdown-container"> -->
        <!-- 渲染 Markdown 内容 -->
        <PDF src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" /> // npm i pdf-vue3
        <!-- <div v-html="parsedExercise" class="markdown-content"></div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';
import { parseMarkdown, parseMarkdownList } from '@/utils/markdownUtils.ts';
import { sessionId, DataThisSession } from './DashCompoents.ts';
import { storageService } from '@/services/storage/storageService';
import PDF from "pdf-vue3";

const generatedContent = ref({
  lessonPlan: {
    objectives: [],
    steps: []
  },
  mindMap: {
    preview: ''
  },
  resources: [],
  exercises: []
});

// 初始化数据函数
const initializeData = async () => {
  if (DataThisSession.value) {
    // 获取教案数据
    const teachingPlan = DataThisSession.value.resources.teaching_plan?.text || '';

    // 获取思维导图
    const mindMap = DataThisSession.value.resources.tp_MindMap?.url || '';

    // 获取课件资源
    const courseware = DataThisSession.value.resources.courseware;

    // 解析资源列表
    const resourcesMarkdown = DataThisSession.value.resources.courseware.videos[0].url || '';
    const resources = parseMarkdownList(resourcesMarkdown);

    const exercises = DataThisSession.value.resources.courseware.exercises[0].url || "";
    const parsedExercise = parseMarkdownList(exercises);


    // 更新组件数据
    generatedContent.value = {
      lessonPlan: parseMarkdown(teachingPlan).__html,
      mindMap: {
        preview: mindMap
      },
      resources: resources.map(resource => ({
        type: 'video',
        title: resource.title,
        url: resource.url
      })),
      exercises: parsedExercise.map(exercise => ({
        title: exercise.title,
        difficulty: '中等',
        preview: exercise.url,
        count: 5
      }))
    };
  } else {
    console.log('DataThisSession.value is null');
  }
};

const showAllExercises = ref(false);

// 直接在组件中定义 Markdown 内容
const markdownContent = ref(`
## 暂无
`);

// // 解析 Markdown 内容为 HTML
// const parsedExercise = computed(() => {
//   return parseMarkdown(markdownContent.value);
// });

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
          <img src="${generatedContent.value.mindMap.preview}" alt="思维导图">
        </body>
      </html>
    `);
  }
};

onMounted(() => {
  initializeData();
});
</script>

<style lang="scss">
.result-content {
  padding: 2rem;

  .result-card {
    height: 100%;
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #1f2937;
      }
    }
  }

  .lesson-plan {
    h4 {
      margin: 1rem 0 0.5rem;
      color: #1f2937;
    }

    ul,
    ol {
      margin: 0;
      padding-left: 1.5rem;
      color: #4b5563;
    }

    li {
      margin-bottom: 0.5rem;
    }
  }

  .resources {
    .resource-card {
      background: #acbac9;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;

      img {
        width: 100%;
        height: 120px;
        object-fit: cover;
      }

      .resource-info {
        padding: 0.75rem;

        h4 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
          color: #1f2937;
        }
      }
    }
  }

  .exercises {
    .exercise-item {
      padding: 1rem;
      border-bottom: 1px solid #0a1d42;

      &:last-child {
        border-bottom: none;
      }

      .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        h4 {
          margin: 0;
          font-size: 0.95rem;
          color: #1f2937;
        }
      }

      .exercise-preview {
        color: #4b5563;
        font-size: 0.875rem;
        margin: 0.5rem 0;
      }

      .exercise-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
        color: #6b7280;
        font-size: 0.875rem;
      }
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .mind-map {
    width: 100%;
    cursor: pointer;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  text-align: center;
}

.exercise-item {
  margin-bottom: 15px;
}

</style>