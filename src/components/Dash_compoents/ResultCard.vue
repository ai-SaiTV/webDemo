<template>
  <!-- 教案内容卡片 -->
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card class="result-card" style="margin: 10px;">
        <template #header>
          <div class="card-header">
            <div style="width: 100%; display: flex; justify-content: space-between;">
              <h3>教案</h3>
              <div>
                <el-button  @click = "saveElementAsURL('教案','.markdown-content','教学课件')" type="primary">收藏至资源库</el-button>
                <el-button @click="exportPDF('.markdown-content')" type="success">下载教案</el-button>
              </div>
              
            </div>
            <el-button type="primary" link @click="initializeData">查看详情</el-button>
          </div>
          <br><br>
        </template>
        <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="generatedContent.lessonPlan" class="markdown-content" style="width: 640px; max-height: 640px; overflow-y: auto;"></div>
            </div>
      </el-card>
    </el-col>

    <!-- 思维导图卡片 -->
    <el-col :span="12">
      <el-card class="result-card" style="margin: 10px;">
        <template #header>
          <div class="card-header">
            <div style="width: 100%; display: flex; justify-content: space-between;">
              <h3>课堂环节设计</h3>
              <div>
                <el-button @click = "saveElementAsURL('课堂环节','.markdown-content1','课堂环节设计')" type="primary">收藏至资源库</el-button>
                <el-button @click="exportPDF('.markdown-content1')" type="success">下载课堂环节设计</el-button>
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="mind-map">
          <img :src="generatedContent.mindMap.preview" alt="思维导图"
            @click="previewMindMap" style="width: 100%; height: auto; display: block;">
        </div> -->
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="课堂环节设计" name="design">
            <!-- 环节设计内容 -->
            <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="generatedContent.classDesign" class="markdown-content1" style="width: 640px; max-height: 680px; overflow-y: auto;"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="思维导图" name="image">
            <!-- 图片内容 -->
            <el-button type="primary" link @click="previewMindMap">查看大图</el-button>
            <div class="mind-map">
              <img :src="generatedContent.mindMap.preview" alt="思维导图"
                @click="previewMindMap" style="width: 100%; height: auto; display: block;">
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>

  <!-- 推荐资源卡片 -->
  <el-row :gutter="20" class="mt-20">
    <el-col :span="12">
      <el-card class="result-card" style="margin: 10px;">
        <template #header>
          <div class="card-header">
            <div style="width: 100%; display: flex; justify-content: space-between;">
              <h3>教学资源推荐</h3>
              
              <el-button @click = "collectAllmaterials" type="primary">收藏全部</el-button>
            </div>
            
            <el-button type="primary" link>查看更多</el-button>
          </div>
        </template>
        <div class="resources">
          <el-row :gutter="20">
            <el-col v-for="(resource, index) in generatedContent.resources" :key="index" :span="12" :style="{
              // width: '20%',
              border: '1px solid var(--el-border-color-light)',
              borderRadius: 'var(--el-border-radius-base)',
              padding: '16px',
              boxShadow: 'var(--el-box-shadow-light)',
              transition: 'all 0.3s var(--el-transition-function-ease-in-out-bezier)',
              backgroundColor: 'var(--el-bg-color)',
              marginBottom: '10px',
            }">
              <div class="resource-card">
                <div class="resource-info">
                  <a :href="resource.url" target="_blank" rel="noopener noreferrer" class = "resource-link">
                    <h4 style="color: black;">{{ resource.title }}</h4>
                  </a>
                  <el-tag size="small">{{ resource.type.toUpperCase() }}</el-tag>
                  <div style="display: flex; justify-content: end;">
                    
                    <el-button  @click = "collectOnematerials(index,resource.type,resource.title,resource.url)" type="primary" size = "small" style="margin-left: 4px;">收藏</el-button>
                  </div>
                 
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>

    <!-- 练习题卡片 -->
    <el-col :span="12">
      <el-card class="result-card" style="margin: 10px;">
        <template #header>
          <div class="card-header">
            <h3>配套练习</h3>
            <el-button type="primary" link @click="showAllExercises = true">查看全部</el-button>
          </div>
        </template>
        <div class="exercises">
          <div 
            v-for="(exercise, index) in generatedContent.exercises" 
            :key="index"
            class="exercise-item" 
            :style="{
              width: '80%',
              border: '1px solid var(--el-border-color-light)',
              borderRadius: 'var(--el-border-radius-base)',
              padding: '16px',
              boxShadow: 'var(--el-box-shadow-light)',
              transition: 'all 0.3s var(--el-transition-function-ease-in-out-bezier)',
              backgroundColor: 'var(--el-bg-color)'
            }"
          >
            <div class="exercise-header">
            <h4>{{ exercise.title }}</h4>
              
              <el-tag size="small" :type="exercise.difficulty === '简单' ? 'success' : 'warning'">
                {{ exercise.difficulty }}
              </el-tag>
            </div>
            <!-- <p class="exercise-preview">{{ exercise.preview }}</p> -->
            <div class="exercise-footer" style="display: flex; justify-content: end;">
              <!-- <span>{{ exercise.count }}道题目</span> -->
              <a :href="exercise.preview" download="file.pdf">
                <el-button type="primary" link size="small">下载</el-button>
              </a>
              <el-button @click = "() => ElMessage('📜布置成功')"  type="primary" size = "small" style="margin-left: 15px;">布置</el-button>

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
        <!-- <PDF src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" />  正在加载中..... -->
        <!-- <div v-html="parsedExercise" class="markdown-content"></div> -->
      <!-- </div> -->
    </div>
  </div>

    <!-- 悬浮 -->
    <!-- 在template最后添加悬浮按钮 -->
  <div class="rating-fab" @click="isRatingOpen = true">
    <el-icon size="24"><Star/></el-icon>
  </div>

  <!-- 评分面板 -->
  <div v-if="isRatingOpen" class="rating-panel">
    <h4>教案生成模块评价</h4>
    <el-rate
      v-model="ratingValue"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
      show-text
      text-color="#ff9900"
      :texts="['极差','一般','良好','优秀','完美']">
    </el-rate>
    <br>
    <div class = "eval-bt">
      <el-button  @click="submitRating"> 提交评价</el-button>
    </div>
    
  </div>





</template>

<script setup>
import { defineProps, ref, computed, onMounted, nextTick} from 'vue';
import { parseMarkdown, parseMarkdownList_ex, parseMarkdownList_re } from '@/utils/markdownUtils.ts';
import { sessionId, DataThisSession,showCollect,Collectcontents,collectMap } from './DashCompoents.ts';
import { storageService } from '@/services/storage/storageService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

import mmPic from '@/assets/files/mmPic.jpeg';
import { ElMessage } from 'element-plus';


// 初始化数据函数
const initializeData = async () => {
  if (DataThisSession.value) {
    // 获取教案数据
    const teachingPlan = DataThisSession.value.resources.teaching_plan?.text || '';

    // 获取课堂环节设计
    const classDesign = DataThisSession.value.resources.class_design?.text || '';

    // 获取思维导图
    //const mindMap = DataThisSession.value.resources.tp_MindMap?.url || '';
    const mindMap = mmPic;



    // 解析资源列表
    const resourcesMarkdown = DataThisSession.value.resources.courseware.Courseware[0].url || '';
    console.log('resource: ',resourcesMarkdown);

    const resources = parseMarkdownList_re(resourcesMarkdown);



    const exercises = DataThisSession.value.resources.courseware.exercises[0].url || "";
    const parsedExercise = parseMarkdownList_ex(exercises);


    // 更新组件数据
    generatedContent.value = {
      lessonPlan: parseMarkdown(teachingPlan).__html,
      classDesign: parseMarkdown(classDesign).__html,
      mindMap: {
        preview: mindMap
      },
      resources: resources.map(resource => ({
        type: resource.type,  // 资源类型
        title: resource.title,
        url: resource.url
      })),
      exercises: parsedExercise.map(exercise => ({
        title: exercise.title,
        difficulty: exercise.type,
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
// const markdownContent = ref(`
// ## 暂无
// `);

// // 解析 Markdown 内容为 HTML
// const parsedExercise = computed(() => {
//   return parseMarkdown(markdownContent.value);
// });

const activeTab = ref('design');

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


const isRatingOpen = ref(false)
const ratingValue = ref(0)

const submitRating = () => {
  if (ratingValue.value > 0) {
    console.log('提交评价:', ratingValue.value)
    isRatingOpen.value = false
  } else {
    alert('请对教学资源准确率进行评价')
  }
};

const collectAllmaterials = () => {
  let newCollectsum = 0;
  if(showCollect.value) {
    ElMessage(' ❗所有资源已收藏');
    return;
  }
  generatedContent.value.resources.forEach((resource,index)=>{
    const resourceKey = `${resource.type}-${resource.title}-${resource.url}`;
    if (!collectMap.value[resourceKey]) {
      const newCollect = {
        type: resource.type,
        title: resource.title,
        url: resource.url
      };
      Collectcontents.value.push(newCollect);
      collectMap.value[resourceKey]=true;
      newCollectsum++;
    }
  });
  showCollect.value = true;
  if (newCollectsum > 0) {
    ElMessage(`⭐成功收藏${newCollectsum}个资源`);
  } else {
    ElMessage(' ❗所有资源已收藏');
  }
};
const collectOnematerials = (index,type,title,url) => {
  const resourceKey = `${type}-${title}-${url}`;
  if (collectMap.value[resourceKey]) {
    ElMessage(' ❗资源已收藏');
    return;
  }
  const newCollect = {
    type: type,
    title: title,
    url: url
  };
  Collectcontents.value.push(newCollect);
  collectMap.value[resourceKey]=true;
  ElMessage(' ⭐收藏成功');
  console.log('收藏的资源:', newCollect);
}
const markdownContent = ref(null);
const saveElementAsURL = async (title, selector,type) => {
  try {
    await nextTick();
    const element = document.querySelector(selector);
    
    if (!element) {
      console.error(`未找到选择器: ${selector}`);
      return;
    }
    element.style.overflow = 'visible';
    element.style.height = 'auto';
    const clone = element.cloneNode(true);
    const container = document.createElement('div');
    container.appendChild(clone);

    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 1,
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight
    });
    
    const dataURL = canvas.toDataURL(`image/png/${title}`); 
    console.log('dataURL:', dataURL); 
    Collectcontents.value.push({
      type: type,
      title: title,
      url: dataURL
    });

    console.log(`成功保存元素: ${title}`);
    console.log('当前内容:', Collectcontents.value);
    ElMessage(' ⭐收藏成功');
    document.body.removeChild(container);
  } catch (error) {
    console.error('保存失败:', error);
  }
};
const exportPDF = async (selector) => {
  try {
    await nextTick();
    
    // const element = markdownContent.value;
    const element = document.querySelector(selector); 
    
    // 重置元素样式
    element.style.overflow = 'visible';
    element.style.height = 'auto';
    
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      width: 840,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const pdfWidth = canvas.width / 3.78; 
    const pdfHeight = canvas.height / 3.78;

    const pdf = new jsPDF({
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
      orientation: pdfWidth > pdfHeight ? 'l' : 'p'
    });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let position = 0;
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      position -= pageHeight;

      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`课程大纲.pdf`);
    console.log('元素尺寸:', {
      width: element.offsetWidth,
      scrollWidth: element.scrollWidth,
      height: element.offsetHeight,
      scrollHeight: element.scrollHeight
    });
  } catch (error) {
    console.error('导出失败:', error);
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
    margin-bottom: 200px;

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
    .mind-map {
    img {
      width: 50%;
      height: 10%;
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
      display: flex;
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
        margin-left: 40px;
        column-gap: 3px;
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



.rating-fab {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  background: #409EFF;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.3);
  z-index: 2000;
}

.rating-panel {
  position: fixed;
  right: 30px;
  bottom: 100px;
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 2000;
  h4 {
    margin-bottom: 15px;
    color: #303133;
  }
  .eval-bt{
    display: flex;
    justify-content: end;
    
  }

}












</style>