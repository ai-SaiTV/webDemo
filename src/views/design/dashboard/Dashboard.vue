<script setup lang="ts">
import ResponseDisplay from '@/components/api_compoents/ResponseDisplay.vue';
import {
  activeStep, nextStep, prevStep,
  generatePlan, previewMindMap, showResult, steps,
  form, form1, Mindimgsrc, progressStatus, imageStyle, toggleImageSize,
  isHovering, isProcessing, isZoomed,
  onWheel, zoomedImageStyle, progress,
  isGenerating, generatedContent, gradientColor,


  response, chatMessages,handleSubmit, isPolling, chatConfig
} from './Dashboard';


</script>

<template>
  <div class="dashboard-container">

        <!-- 测试接口 -->
        <!-- Chat  -->
        <div class="w-full">
          <button
            @click="handleSubmit"
            :disabled="isPolling || !chatConfig.apiKey || !chatConfig.botId || !chatConfig.message"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ isPolling ? 'Generating Response...' : 'Send Message' }}
            
          </button>

          <ResponseDisplay 
          :response="response"
          :messages="chatMessages"
        />
      
        </div>
      <!-- chat -->

    <el-row :gutter="24">
      <el-col :span="showResult ? 24 : 16">
        <el-card class="main-card" :body-style="{ padding: '0' }">
          <template v-if="!showResult">
            <div class="plan-header">
              <h2>教案生成</h2>
              <p class="subtitle">智能分析教学需求，快速生成专业教案</p>
            </div>
            <el-progress v-if="isProcessing" :percentage="progress" :stroke-width="8" :color="gradientColor"
              :status="progressStatus" />

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
                        <img :src="Mindimgsrc" alt="思维导图" :style="imageStyle" @click="toggleImageSize"
                          @mouseenter="isHovering = true" @mouseleave="isHovering = false" />
                      </el-form-item>
                    </el-col>
                    <!-- 放大的图片和背景遮罩 -->
                    <div v-if="isZoomed" class="overlay" @click="toggleImageSize">
                      <div class="zoomed-image-container" @click.stop @wheel="onWheel">
                        <img :src="Mindimgsrc" alt="放大的思维导图" class="zoomed-image" :style="zoomedImageStyle" />
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
@import "./Dashstyle.css";
</style>