<script setup lang="ts">
import { ref } from 'vue'

const activeStep = ref(0)
const isGenerating = ref(false)
const showResult = ref(false)

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
  { title: '基本信息', description: '选择年级、学科等基本信息' },
  { title: '教学目标', description: '设置本节课的教学重点和难点' },
  { title: '教学要求', description: '补充具体教学要求和注意事项' },
  { title: '智能生成', description: '基于输入自动生成教案' }
]

const difficultyOptions = [
  { label: '容易', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '较难', value: 'hard' }
]

const focusOptions = [
  { label: '知识理解', value: 'knowledge' },
  { label: '技能培养', value: 'skills' },
  { label: '思维发展', value: 'thinking' },
  { label: '实践应用', value: 'practice' }
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
              <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.description" />
            </el-steps>

            <div class="step-content">
              <!-- 步骤1：基本信息 -->
              <div v-if="activeStep === 0" class="step-form">
                <el-form :model="form" label-position="top">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="年级">
                        <el-select v-model="form.grade" placeholder="选择年级">
                          <el-option label="一年级" value="grade1" />
                          <el-option label="二年级" value="grade2" />
                          <el-option label="三年级" value="grade3" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="学科">
                        <el-select v-model="form.subject" placeholder="选择学科">
                          <el-option label="语文" value="chinese" />
                          <el-option label="数学" value="math" />
                          <el-option label="英语" value="english" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="单元">
                        <el-input v-model="form.unit" placeholder="请输入单元名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="课题">
                        <el-input v-model="form.topic" placeholder="请输入课题名称" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>

              <!-- 步骤2：教学目标 -->
              <div v-if="activeStep === 1" class="step-form">
                <el-form :model="form" label-position="top">
                  <el-form-item label="课程时长">
                    <el-input-number v-model="form.duration" :min="30" :max="90" :step="5" />
                    <span class="unit-label">分钟</span>
                  </el-form-item>
                  <el-form-item label="难度等级">
                    <el-radio-group v-model="form.difficulty">
                      <el-radio-button v-for="option in difficultyOptions" :key="option.value" :label="option.value">
                        {{ option.label }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="教学重点">
                    <el-checkbox-group v-model="form.focus">
                      <el-checkbox v-for="option in focusOptions" :key="option.value" :label="option.value">
                        {{ option.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 步骤3：教学要求 -->
              <div v-if="activeStep === 2" class="step-form">
                <el-form :model="form" label-position="top">
                  <el-form-item label="具体要求">
                    <el-input
                      v-model="form.requirements"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入具体的教学要求和注意事项..."
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 步骤4：生成结果 -->
              <div v-if="activeStep === 3" class="generation-step">
                <el-result
                  icon="success"
                  title="准备就绪"
                  sub-title="已收集所有必要信息，点击下方按钮开始生成教案"
                >
                  <template #extra>
                    <el-button
                      type="primary"
                      size="large"
                      :loading="isGenerating"
                      @click="generatePlan"
                    >
                      {{ isGenerating ? '正在生成...' : '开始生成' }}
                    </el-button>
                  </template>
                </el-result>
              </div>
            </div>

            <div class="step-actions">
              <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
              <el-button
                v-if="activeStep < steps.length - 1"
                type="primary"
                @click="nextStep"
              >
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
                      <img
                        :src="generatedContent.mindMap.preview"
                        alt="思维导图"
                        style="width: 100%; cursor: pointer"
                        @click="previewMindMap"
                      >
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
                        <el-col
                          v-for="(resource, index) in generatedContent.resources"
                          :key="index"
                          :span="12"
                        >
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
                      <div
                        v-for="(exercise, index) in generatedContent.exercises"
                        :key="index"
                        class="exercise-item"
                      >
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
            <el-timeline-item
              v-for="(activity, index) in 4"
              :key="index"
              :timestamp="'2024-03-0' + (index + 1)"
              placement="top"
            >
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

      ul, ol {
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

  .stat-card, .recent-card {
    margin-bottom: 1.5rem;
    
    .stat-header, .recent-header {
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
</style>