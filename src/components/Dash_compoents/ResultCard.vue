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
  <!-- 全部练习的覆盖层 -->
  <div v-if="showAllExercises" class="overlay" @click="showAllExercises = false">
    <div class="overlay-content" @click.stop>
      <div class="markdown-container">
      <!-- 渲染 Markdown 内容 -->
      <div v-html="parsedExercise" class="markdown-content"></div>
  </div>
    </div>
  </div>
</template>

<script setup>
import { progressProps } from 'element-plus';
import { defineProps , ref , computed } from 'vue';
import { parseMarkdown } from '@/utils/markdownUtils';

const props = defineProps({
  generatedContent: {
    type: Object,
    required: true,
  },
});

const showAllExercises = ref(false);

// 直接在组件中定义 Markdown 内容
const markdownContent = ref(`
# 《杨氏之子》练习题\n## 一、选择题（每题5分，共25分）\n1. 题目：下列句子中，朗读停顿不恰当的一项是（ ）\n    - 选项：A. 孔君平/诣/其父，父/不在，乃/呼儿出。\n    - 选项：B. 未闻孔雀/是/夫子家禽。\n    - 选项：C. 孔/指以示儿/曰：“此/是君/家果。”\n    - 选项：D. 梁国/杨氏子/九岁，甚聪惠。\n2. 题目：下列对课文的理解有误的一项是（ ）\n    - 选项：A. 本文选自《世说新语》。\n    - 选项：B. 杨氏之子的回答妙在以其人之道还治其人之身。\n    - 选项：C. 杨氏之子的回答体现了他的机智和幽默。\n    - 选项：D. 杨氏之子的回答体现了他的不礼貌。\n3. 题目：“梁国杨氏子九岁，甚聪惠。”这句话的意思是（ ）\n    - 选项：A. 梁国杨家的儿子九岁了，非常聪明。\n    - 选项：B. 梁国杨家的儿子九岁了，非常聪慧。\n    - 选项：C. 梁国杨家的女儿九岁了，非常聪明。\n    - 选项：D. 梁国杨家的女儿九岁了，非常聪慧。\n4. 题目：“孔指以示儿曰：‘此是君家果。’”这句话的意思是（ ）\n    - 选项：A. 孔君平指着杨梅给孩子看，说：“这是你家的水果。”\n    - 选项：B. 孔君平指着杨梅给孩子看，说：“这是我家的水果。”\n    - 选项：C. 孔君平指着杨梅给孩子看，说：“这是你家的果子。”\n    - 选项：D. 孔君平指着杨梅给孩子看，说：“这是我家的果子。”\n5. 题目：“儿应声答曰：‘未闻孔雀是夫子家禽。’”这句话的意思是（ ）\n    - 选项：A. 孩子马上回答说：“我可没听说孔雀是先生您家的鸟。”\n    - 选项：B. 孩子马上回答说：“我可没听说孔雀是夫子您家的家禽。”\n    - 选项：C. 孩子马上回答说：“我可没听说孔雀是先生您家的家禽。”\n    - 选项：D. 孩子马上回答说：“我可没听说孔雀是夫子您家的鸟。”\n\n## 二、填空题（每题5分，共25分）\n1. 题目：《杨氏之子》选自南朝刘义庆的《世说新语》，该书是一部记载汉末至晋代士族阶层言谈轶事的小说。\n答案：世说新语\n2. 题目：“甚聪惠”的意思是非常聪明。\n答案：非常聪明\n3. 题目：“孔君平诣其父”的意思是孔君平拜见他的父亲。\n答案：拜见\n4. 题目：“乃呼儿出”的意思是于是叫他的儿子出来。\n答案：于是\n5. 题目：“为设果”的意思是为他摆设水果。\n答案：为他摆设\n\n## 三、简答题（每题10分，共20分）\n1. 题目：杨氏之子的回答妙在哪里？\n答案：杨氏之子的回答妙在以其人之道还治其人之身。孔君平在姓上做文章，孩子也在姓上做文章，由孔君平的“孔”姓想到了孔雀；最妙的是，他没有生硬地直接说“孔雀是夫子家禽”，而是采用了否定的方式，说“未闻孔雀是夫子家禽”，婉转对答，既表现了应有的礼貌，又表达了“既然孔雀不是您家的鸟，杨梅岂是我家的果”这个意思，使孔君平无言以对。\n2. 题目：你认为杨氏之子是一个怎样的孩子？\n答案：杨氏之子是一个聪明、机智、幽默的孩子。他能够听懂孔君平的话中之意，并能够巧妙地回答，既表现了他的聪明才智，又表现了他的幽默风趣。\n\n## 四、应用题（每题10分，共20分）\n1. 题目：如果你是杨氏之子，你会怎么回答孔君平的话？\n答案：如果我是杨氏之子，我会这样回答孔君平的话：“谢谢您的夸奖，我也听说过一句话，叫做‘有其父必有其子’，我想这句话用在您和孔雀身上也很合适呢！”\n2. 题目：请你根据《杨氏之子》的故事，写一篇作文，题目自拟。\n答案：《聪明的杨氏之子》\n\n在梁国，有一户姓杨的人家，家里有一个九岁的儿子，非常聪明。有一天，孔君平来拜见他的父亲，恰巧他父亲不在家，于是孔君平就把这个孩子叫了出来。\n\n孩子给孔君平端来了水果，其中有杨梅。孔君平指着杨梅给孩子看，说：“这是你家的水果。”孩子马上回答说：“我可没听说孔雀是先生您家的鸟。”\n\n孔君平听了，哈哈大笑，说：“你真是一个聪明的孩子！”孩子也笑了，说：“谢谢您的夸奖！”\n\n这个故事告诉我们，遇到问题要善于思考，灵活应对，这样才能解决问题。
`);

// 解析 Markdown 内容为 HTML
const parsedExercise = computed(() => {
  return parseMarkdown(markdownContent.value);
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
      background: #f8fafc;
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
      border-bottom: 1px solid #e5e7eb;

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
/* 使用 GitHub 风格的 Markdown 样式 */
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #24292e;
  text-align: left; /* 设置内容左对齐 */
}

.markdown-content h1 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-content ul {
  padding-left: 2em;
  list-style-type: disc;
}

.markdown-content li {
  margin: 0.25em 0;
}
</style>