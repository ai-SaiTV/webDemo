<script setup lang="ts">
import { ref } from 'vue'

const activeStep = ref(0)
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

const generatePlan = () => {
  // TODO: 实现教案生成逻辑
  console.log('Generating plan with:', form.value)
}
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="16">
        <el-card class="main-card" :body-style="{ padding: '0' }">
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
                  <el-button type="primary" size="large" @click="generatePlan">
                    开始生成
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
        </el-card>
      </el-col>

      <el-col :span="8">
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
}
</style>