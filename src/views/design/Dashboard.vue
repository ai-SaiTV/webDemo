<script setup lang="ts">
import { ref, computed } from 'vue'

const activeStep = ref(0)
const isGenerating = ref(false)
const showResult = ref(false)

const imageSrc = 'https://img1.baidu.com/it/u=4289792486,3256351331&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1133'//图片路径（该处需要修改）
const isZoomed = ref(false) // 用于判断图片是否放大
const isHovering = ref(false) // 控制鼠标是否悬停在图片上
const translateY = ref(0) // 控制图片的上下滑动

const form = ref({
  grade: '',
  subject: '',
  unit: '',
  topic: '',
  duration: 45,
  difficulty: 'medium',
  focus: [],
  requirements: ''
})

const steps = [
  { title: '大纲生成', description: '一句话生成大纲' },
  { title: '大纲修改', description: '提供修改以保证贴合教学安排' },
  { title: '导图生成', description: '根据教学大纲生成思维导图' },
  { title: '智能生成', description: '总结教学大纲与思维导图' }
]



// 模拟生成的教案数据
const generatedContent = ref({
  lessonPlan: {
    title: '认识分数',
    objectives: [
      '理解分数的基本概念',
      '掌握分数的读写方法',
      '能够运用分数解决简单的实际问题'
    ],
    steps: [
      '导入：通过生活中的实例引入分数概念',
      '讲解：分数的表示方法和意义',
      '练习：基础练习和应用题',
      '总结：归纳本节课重点'
    ]
  },
  resources: [
    {
      title: '分数动画课件',
      type: 'ppt',
      url: '#',
      preview: 'https://picsum.photos/300/200'
    },
    {
      title: '分数教学视频',
      type: 'video',
      url: '#',
      preview: 'https://picsum.photos/300/200'
    }
  ],
  exercises: [
    {
      title: '基础练习',
      count: 10,
      difficulty: '简单',
      preview: '1. 将下列图形中的阴影部分用分数表示...'
    },
    {
      title: '提高练习',
      count: 5,
      difficulty: '中等',
      preview: '1. 小明吃了一个苹果的3/4，小红吃了...'
    }
  ],
  mindMap: {
    preview: 'https://picsum.photos/800/400',
    nodes: [
      { id: 1, text: '分数的概念', x: 400, y: 200 },
      { id: 2, text: '分数的读写', x: 300, y: 300 },
      { id: 3, text: '分数的意义', x: 500, y: 300 }
    ]
  }
})

const nextStep = () => {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const generatePlan = async () => {
  isGenerating.value = true
  // 模拟生成过程
  await new Promise(resolve => setTimeout(resolve, 2000))
  isGenerating.value = false
  showResult.value = true
}

const previewMindMap = () => {
  // 在新窗口中打开思维导图预览
  const mindMapWindow = window.open('', '_blank')
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
    `)
  }
}

// 控制图片放大和缩小
const toggleImageSize = () => {
  isZoomed.value = !isZoomed.value
  translateY.value = 0 // 重置缩放级别
}

// 鼠标滚轮事件，控制图片的上下滑动
const onWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    // 向下滚动，图片向上滑动
    translateY.value = Math.min(translateY.value - 40, 0) // 设置最大滑动范围
  } else {
    // 向上滚动，图片向下滑动
    translateY.value = Math.max(translateY.value + 40, -500) // 设置最小滑动范围
  }
}

// 放大后的图片样式
const zoomedImageStyle = computed(() => ({
  transform: `translateY(${translateY.value}px)`, // 控制图片的缩放
  transition: 'transform 0.3s ease-in-out', // 平滑过渡
}))

const imageStyle = computed(() => ({
  width: '100%',
  height: 'auto',
  cursor: isHovering.value ? 'zoom-in' : 'default', // 鼠标悬停时显示放大镜
}))

const form1 = ref({
  requirements: `《算法与数据结构：二叉树》教学大纲...`
});


</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="showResult ? 24 : 16">
        <el-card class="main-card" :body-style="{ padding: '0' }">
          <template v-if="!showResult">
            <div class="plan-header">
              <h2>教案生成</h2>
              <p class="subtitle">智能分析教学需求，快速生成专业教案</p>
            </div>

            <el-steps :active="activeStep" finish-status="success" process-status="process" class="custom-steps">
              <el-step v-for="(step, index) in steps" :key="index" :title="step.title"
                :description="step.description" />
            </el-steps>

            <div class="step-content">
              <!-- 步骤1：大纲生成 -->
              <div v-if="activeStep === 0" class="step-form">
                <el-form :model="form" label-position="top">
                  <el-row :gutter="20" justify="center">
                    <el-col :span="20">
                      <el-form-item label="输入课程名称">
                        <span>&nbsp;</span>
                        <el-input v-model="form.unit" placeholder="如：算法与数据结构的二叉树课">
                          <template #prepend>我想生成一节</template>
                          <template #append>的教案</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <!-- 步骤2：大纲修改 -->
              <div v-if="activeStep === 1" class="step-form">
                <el-form :model="form" label-position="top">
                  <el-row :gutter="24" justify="center">
                    <el-form-item label="大纲内容">
                      <textarea v-model="form1.requirements" rows="50" placeholder="请输入具体的教学要求和注意事项..."
                        class="custom-textarea"></textarea>
                    </el-form-item>
                  </el-row>
                </el-form>
              </div>
              <!-- 步骤3：教学要求 -->
              <div v-if="activeStep === 2" class="step-form">
                <el-form :model="form1" label-position="top">
                  <el-row :gutter="24" justify="center">
                    <el-col :span="12">
                      <el-form-item label="大纲内容">
                        <textarea v-model="form1.requirements" rows="35" placeholder="请输入具体的教学要求和注意事项..."
                          class="custom-textarea"></textarea>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="思维导图（单击放大）">
                        <img 
                        loading="lazy" 
                        :src="imageSrc" 
                        alt="思维导图" 
                        :style="imageStyle"
                        @click="toggleImageSize"
                        @mouseenter="isHovering = true" 
                        @mouseleave="isHovering = false" 
                        />
                      </el-form-item>
                    </el-col>
                    <!-- 放大的图片和背景遮罩 -->
                    <div v-if="isZoomed" class="overlay" @click="toggleImageSize">
                      <div class="zoomed-image-container" @click.stop @wheel="onWheel">
                        <img 
                        :src="imageSrc" 
                        alt="放大的思维导图" 
                        class="zoomed-image"
                        :style="zoomedImageStyle" 
                        />
                        <button class="close-btn" @click="toggleImageSize">X</button>
                      </div>
                    </div>
                  </el-row>
                </el-form>
              </div>
              <!-- 步骤4：生成结果 -->
              <div v-if="activeStep === 3" class="generation-step">
                <el-result icon="success" title="准备就绪" sub-title="已收集所有必要信息，点击下方按钮开始生成教案">
                  <template #extra>
                    <el-button type="primary" size="large" :loading="isGenerating" @click="generatePlan">
                      {{ isGenerating ? '正在生成...' : '开始生成' }}
                    </el-button>
                  </template>
                </el-result>
              </div>
            </div>

            <div class="step-actions">
              <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
              <el-button v-if="activeStep < steps.length - 1" type="primary" @click="nextStep">
                下一步
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
        </el-card>
      </el-col>

      <el-col v-if="!showResult" :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="stat-header">
              <h3>数据概览</h3>
            </div>
          </template>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">已创建教案</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">25</div>
              <div class="stat-label">收藏资源</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">98%</div>
              <div class="stat-label">好评率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">45</div>
              <div class="stat-label">课时总数</div>
            </div>
          </div>
        </el-card>

        <el-card class="recent-card">
          <template #header>
            <div class="recent-header">
              <h3>最近生成</h3>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in 4" :key="index"
              :timestamp="'2024-0' + (activity + 1) + '-0' + (index + 1)" placement="top">
              <div class="timeline-content">
                <h4>{{ ['语文', '数学', '英语', '科学'][index] }}教案</h4>
                <p>{{ ['阅读理解', '分数运算', '语法练习', '植物生长'][index] }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  .plan-header {
    background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
    color: white;
    padding: 2rem;
    border-radius: 8px 8px 0 0;

    h2 {
      margin: 0;
      font-size: 1.75rem;
    }

    .subtitle {
      margin: 0.5rem 0 0;
      opacity: 0.9;
    }
  }

  .result-header {
    background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
    color: white;
    padding: 2rem;
    border-radius: 8px 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 1.75rem;
    }
  }

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
  }

  .custom-steps {
    padding: 2rem 2rem 0;

    :deep(.el-step__title) {
      font-size: 0.9rem;
    }

    :deep(.el-step__description) {
      font-size: 0.8rem;
    }
  }

  .step-content {
    padding: 2rem;
    min-height: 300px;

    .step-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .unit-label {
      margin-left: 8px;
      color: #666;
    }
  }

  .step-actions {
    padding: 1rem 2rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .stat-card,
  .recent-card {
    margin-bottom: 1.5rem;

    .stat-header,
    .recent-header {
      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #1f2937;
      }
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    .stat-item {
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      text-align: center;

      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1890ff;
        line-height: 1.2;
      }

      .stat-label {
        margin-top: 0.5rem;
        color: #64748b;
        font-size: 0.875rem;
      }
    }
  }

  .timeline-content {
    h4 {
      margin: 0;
      color: #1f2937;
      font-size: 0.95rem;
    }

    p {
      margin: 0.25rem 0 0;
      color: #64748b;
      font-size: 0.875rem;
    }
  }

  .generation-step {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .mt-20 {
    margin-top: 20px;
  }
}

.custom-textarea {
  padding: 2%;
  background-color: #4b5563;
  border-radius: 15px;
  width: 100vh;
  max-width: 800px;
  background-color: white;
  color: black;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  /* 背景暗化 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.zoomed-image-container {
  position: relative;
  max-width: 90%;
  max-height: 110%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoomed-image {
  width: auto;
  height: auto;
  transform-origin: center center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  color: black;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
}

.close-btn:hover {
  background-color: #ff4d4f;
  color: white;
}

img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
  /* 放大一点用于提示 */
}
</style>