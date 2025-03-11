<template>
  <div>
    <!-- 步骤1：to大纲生成 -->
    <div v-if="activeStep === 0" class="step-form">
      <el-form :model="form" label-position="top">
        <el-row :gutter="20" justify="center">
          <el-col :span="20">
            <el-form-item label=" ">
              <span>&nbsp;</span>
              <el-input v-model="form.unit" placeholder="如：人教版小学语文五年级下册《田忌赛马》" @keydown.enter.prevent="handleEnter">
                <template #prepend>我想生成一节</template>
                <template #append>的教案</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 步骤2：to课堂设计 -->
    <div v-if="activeStep === 1" class="step-form">
      <el-form :model="form" label-position="top">
        <el-row :gutter="24" justify="center" class="scroll-container">
          <div class="floating-button">

            <el-button type="primary" @click="handleNext">
              <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
              优化
            </el-button>

          </div>
          <el-form-item label=" ">
            <div v-if="!isForm1Editing">
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;">
              </div>
            </div>
            <div v-else>
              <textarea v-model="form1.requirements" rows="10" placeholder="请输入具体的教学要求和注意事项..."
                class="custom-textarea"></textarea>
            </div>
            <div class="form-buttons">
            </div>
          </el-form-item>
        </el-row>

        <!-- <el-row :gutter="24" justify="center">
          <el-form-item label=" ">
            <div v-if="!isForm1Editing">
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;"></div>
            </div>
            <div v-else>
              <textarea
                v-model="form1.requirements"
                rows="10"
                placeholder="请输入具体的教学要求和注意事项..."
                class="custom-textarea"
              ></textarea>
            </div>
            <div class="form-buttons">

              <el-button type="primary" @click="isForm1Editing = !isForm1Editing; dialogVisible = true;" >
                <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
                {{ isForm1Editing  ? '保存' : '优化' }}
              </el-button>
            </div>
          </el-form-item>

        </el-row> -->
      </el-form>
    </div>

    <!-- 步骤3：to思维导图 -->
    <div v-if="activeStep === 2" class="step-form">
      <el-form :model="form" label-position="top">

        <el-row :gutter="24" justify="center" class="scroll-container">
          <div class="floating-button">

            <el-button type="primary" @click="handleNext">
              <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
              优化
            </el-button>

          </div>
          <el-dialog v-model="dialogVisible" title="优化提示" width="30%" center :close-on-click-modal="false">
            <el-input v-model="inputText" type="textarea" :rows="4" placeholder="你希望如何编写或优化提示词" resize="none" />
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确认</el-button>
              </div>
            </template>
          </el-dialog>

          <el-form-item label=" ">
            <div v-if="!isForm1Editing">
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;">
              </div>
            </div>
            <div v-else>
              <textarea v-model="form1.requirements" rows="10" placeholder="暂无" class="custom-textarea"></textarea>
            </div>
            <div class="form-buttons">
            </div>
          </el-form-item>
        </el-row>


        <!-- <el-row :gutter="24" justify="center">
          <el-form-item label=" ">
            <div v-if = "!isForm1Editing">
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;"></div>
            </div>
            <div v-else>
              <textarea v-model="form1.requirements" rows="50" placeholder="请输入具体的教学要求和注意事项..."
              class="custom-textarea"></textarea>
            </div>
            <div class="form-buttons">
              <el-button type="primary" @click="isForm1Editing = !isForm1Editing">
              
                <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
                <span class="gradient-text">{{ isForm1Editing ? '保存' : '优化' }}</span>

              </el-button>
            </div>
          </el-form-item>
        </el-row> -->
      </el-form>
    </div>

    <div v-if="activeStep === 3" class="step-form">
      <el-form :model="form1" label-position="top">
        <el-row :gutter="24" justify="center">
          <el-col :span="12">
            <el-form-item label=" ">
              <div v-if="!isForm1Editing">
                <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;">
                </div>
              </div>
              <div v-else>
                <textarea v-model="form1.requirements" rows="50" placeholder="请输入具体的教学要求和注意事项..."
                  class="custom-textarea"></textarea>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课堂流程思维导图（单击放大）">
              <img :src="Mindimgsrc" alt="思维导图" :style="imageStyle" @click="toggleImageSize"
                @mouseenter="isHovering = true" @mouseleave="isHovering = false" @wheel="onWheel" />
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
    <div v-if="activeStep === 4" class="generation-step">
      <el-result icon="success" title="准备就绪" sub-title="已收集所有必要信息，点击下方按钮开始生成教案">
        <template #extra>
          <el-button type="primary" size="large" :loading="isGenerating" @click="generateResource">
            {{ isGenerating ? '正在生成...' : '开始生成' }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>
<script setup>

import flash from '@/assets/icons/dashBoard/flash.png'

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ResponseDisplay from '@/components/api_compoents/ResponseDisplay.vue';
import {
  response, chatMessages, handleSubmit, isPolling, chatConfig
} from '@/components/api_compoents/api_handler';

import { generateResource, isForm1Editing } from './DashCompoents';



const props = defineProps({
  activeStep: Number,
  translateY: Number,
  form: Object,
  form1: Object,
  Mindimgsrc: String,
  isZoomed: Boolean,
  imageStyle: Object,
  endWaitingTime: Number,
  showResult: Boolean,
  isGenerating: Boolean,
  isForm1Editing: Boolean,  //Form1编辑状态
});

const showResult = ref(false);
const isHovering = ref(false);
const isProcessing = ref(false);

const emit = defineEmits([
  'update:showResult',
  'update:isZoomed',
  'update:translateY',
  'triggerNextStep']);

const toggleImageSize = () => {
  emit('update:isZoomed', !props.isZoomed);
  emit('update:translateY', 0);
};

const onWheel = (event) => {
  const newTranslateY = event.deltaY > 0
    ? Math.min(props.translateY - 40, 0)
    : Math.max(props.translateY + 40, -500);

  emit('update:translateY', newTranslateY);
};

const handleEnter = (event) => {
  emit('triggerNextStep', event);
};
const wheelOptions = { passive: true };

onMounted(() => {
  const zoomedImageContainer = document.querySelector('.zoomed-image');
  zoomedImageContainer && zoomedImageContainer.addEventListener('wheel', onWheel, wheelOptions);
});

onBeforeUnmount(() => {
  const zoomedImageContainer = document.querySelector('.zoomed-image');
  zoomedImageContainer && zoomedImageContainer.removeEventListener('wheel', onWheel, wheelOptions);
});

const zoomedImageStyle = computed(() => ({
  transform: `translateY(${props.translateY}px)`,
  transition: 'transform 0.3s ease-in-out',
}));

const imageStyle = computed(() => ({
  width: '100%',
  height: 'auto',
  cursor: isHovering.value ? 'zoom-in' : 'default',
}));

// const generatePlan = async () => {
//   isGenerating.value = true;
//   setTimeout(() => {
//     isProcessing.value = false;
//     showResult.value = true;
//     console.log(showResult.value);
//     emit('update:showResult', showResult.value);
//   }, props.endWaitingTime);
// };


// 控制 Dialog 显示
const dialogVisible = ref(false);

// 存储用户输入的优化建议
const optimizationSuggestion = ref('');

// 打开 Dialog
const handleNext = () => {
  
  dialogVisible.value = true;
  console.log('dialogVisible:', dialogVisible.value);
};

// 提交优化建议
const handleConfirm = () => {
  console.log('优化建议：', optimizationSuggestion.value);
  dialogVisible.value = false;
  optimizationSuggestion.value = ''; // 清空输入
};

// 取消提交
const handleCancel = () => {
  dialogVisible.value = false;
  optimizationSuggestion.value = ''; // 清空输入
};
// 关闭 Dialog 前的回调
const handleClose = (done) => {
  done();
}
</script>

<style scoped lang="scss">
.generation-step {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.step-form {
  max-width: 800px;
  margin: 0 auto;
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


//优化按钮
.scroll-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.floating-button {
  position: absolute;
  top: 40px;
  right: 20px;
  z-index: 10;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>