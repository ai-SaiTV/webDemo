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
            <el-dropdown
            trigger="click"
            placement="bottom-end"  
            @visible-change="handleDropdownChange"
            >
              <el-button type="primary">
                <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
                优化
              </el-button>
              <template #dropdown>

                <el-dropdown-menu class="custom-dropdown">
                  <div v-if = "!isEditing && !isEditingFinish" class = "opt-content">
                    <el-input 
                      v-model="optimizationSuggestion" 
                      type="textarea" 
                      :rows="2" 
                      placeholder="你希望如何修改教案"
                      resize="none"
                      style="border: 15px;"
                    />
                  </div>

                  <div v-else-if="isEditing && !isEditingFinish" class = "opt-content">
                    正在生成中⏲️...
                  </div>
                  
                  <div v-else class = "opt-content">
                    <div v-html="EditZoneContent" class="markdown-content" style="max-height: 600px; overflow-y: auto;">
                    </div>
                  </div>

                  <div class="dropdown-footer">
                    <el-button @click="handleCancel" :disabled = "isEditing || !isEditingFinish">替换</el-button>
                    <el-button type="primary" @click="handleConfirm" :disabled = "isEditing || isEditingFinish">确认</el-button>
                  </div>
                </el-dropdown-menu>

              </template>
            </el-dropdown>




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


            <el-dropdown
            trigger="click"
            placement="bottom-end"  
            @visible-change="handleDropdownChange"
            >
              <el-button type="primary">
                <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
                优化
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="custom-dropdown">
                  <el-input 
                    v-model="optimizationSuggestion" 
                    type="textarea" 
                    :rows="2" 
                    placeholder="你希望如何修改课堂环节设计"
                    resize="none"
                    style="border: 15px;"
                  />
                  <div class="dropdown-footer">
                    <!-- <el-button @click="handleCancel">取消</el-button> -->
                    <el-button type="primary" @click="handleConfirm">确认</el-button>
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            
          </div>
          

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
      <el-result icon="success" title="准备就绪" sub-title="根据教案、课堂设计和思维导图，推荐和生成资源">
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
import {
  response, chatMessages, handleSubmit, isPolling, chatConfig
} from '@/components/api_compoents/api_handler';

import { EditSubmit, EditZoneContent, generateResource, isEditing, isEditingFinish, isForm1Editing,isProcessing} from './DashCompoents';


//scss
import '@/components/Dash_compoents/StepForm.scss';


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

const isHovering = ref(false);


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


// 控制 Dropdown 显示
const isDropdownVisible = ref(false);

// 存储用户输入的优化建议
const optimizationSuggestion = ref('');

// // 打开 Dialog
// const handleNext = () => {
//   dialogVisible.value = true;
//   console.log('dialogVisible:', dialogVisible.value);
// };

// 提交优化建议
const handleConfirm = () => {
  EditSubmit();
  console.log('ed_input_submit:', optimizationSuggestion.value);
  // isDropdownVisible.value = false;
  optimizationSuggestion.value = ''; // 清空输入
};

// 提交替换
const handleReplace = () => {
  //提交替换，替换原有的教案内容为EditZone中的内容
};


// // 关闭 Dialog 前的回调
// const handleClose = (done) => {
//   done();
// }

</script>





<style scoped lang="scss">


</style>
