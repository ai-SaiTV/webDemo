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
            <div class = "option-container">
                <el-dropdown 
                  trigger="hover"
                  class="checkbox-dropdown"
                >
                  <template #default>
                    <el-checkbox v-model="checked1" label="加入学情分析提示词"  border />
                  </template>
                  <template #dropdown>
                    <el-dropdown-menu>
                      
                        <div class = "fp_container" style = "overflow-y: auto; max-height: 300px;">
                          <div v-html="fprompt_content"></div>
                        </div>
                        
                      
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                
                <el-checkbox v-model="checked2" label="使用资源库"  border />

            </div>

          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 步骤2：to课堂设计 -->
    <div v-if="activeStep === 1" class="step-form">
      <el-form :model="form" label-position="top">
        <el-row :gutter="24" justify="center" class="scroll-container">
          <OptimizeButton
          :is-editing="isEditing"
          :is-editing-finish="isEditingFinish"
          v-model:optimization-suggestion="optimizationSuggestion"
          :edit-zone-content="EditZoneContent"
          placeholder="请给输入优化建议"
          @dropdown-change="handleDropdownChange"
          @replace="handleReplace"
          @confirm="handleConfirm"
          v-model:is-editing-textarea="localIsEditingTextarea" 
          />
          <el-form-item label=" ">
            <div v-if="!localIsEditingTextarea">
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 600px; overflow-y: auto;"></div>
            </div>
            <div v-else>
              <textarea v-model="form1.requirements" rows="50" placeholder="请输入具体的教学要求和注意事项..."
                class="custom-textarea"></textarea>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <!-- 步骤3：to思维导图 -->
    <div v-if="activeStep === 2" class="step-form">
      <el-form :model="form" label-position="top">

        <el-row :gutter="24" justify="center" class="scroll-container">
          <OptimizeButton
          :is-editing="isEditing"
          :is-editing-finish="isEditingFinish"
          v-model:optimization-suggestion="optimizationSuggestion"
          :edit-zone-content="EditZoneContent"
          placeholder="请给输入优化建议"
          @dropdown-change="handleDropdownChange"
          @replace="handleReplace"
          @confirm="handleConfirm"
          v-model:is-editing-textarea="localIsEditingTextarea" 
          />
          <el-form-item label=" ">
            <div v-if="!localIsEditingTextarea">
              
              <div v-html="form1.requirements" class="markdown-content" style="max-height: 450px; overflow-y: auto;">
              </div>
            </div>
            <div v-else>
              <textarea v-model="form1.requirements" rows="20" placeholder="暂无" class="custom-textarea"></textarea>
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
              <div v-if="!localIsEditingTextarea">
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
      <el-result icon="success" title="准备就绪" sub-title="整合教案、课堂设计、思维导图和教学资源">
        <template #extra>
          <el-button type="primary" size="large" :loading="isGenerating" @click="generateResource">
            {{ isGenerating ? '正在整合...' : '开始整合' }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>
<script setup>

import flash from '@/assets/icons/dashBoard/flash.png';

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  response, chatMessages, handleSubmit, isPolling, chatConfig
} from '@/components/api_compoents/api_handler';

import { activeStep, EditSubmit, EditZoneContent, 
  generateResource, isEditing, isEditingFinish,
   isForm1Editing, isProcessing, handleReplace,
   optimizationSuggestion, isDropdownVisible, handleConfirm } from './DashCompoents';

//Edit OptimizeButton
import OptimizeButton from './EditDropDown.vue';

const localIsEditingTextarea = ref(false);


//scss
import '@/components/Dash_compoents/StepForm.scss';
import { parseMarkdown } from '@/utils/markdownUtils';



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
  fprompt_content.value = parseMarkdown(fprompt_content.value).__html;
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


const checked1 = ref(false);
const checked2 = ref(false);

const fprompt_content = ref(`
**班级基础数据提示词：**
- 班级规模：32人
- 前置知识合格率：76%（达标线80分）
- 成绩极差：95分（张三）↔58分（李四）
- 最近三次测试均分波动：±3.5分

**能力分层提示词：**
1. 优秀层（18%/6人）：
   - 典型表现：独立完成文言文字词翻译（如赵六95分案例）
   - 高阶能力：古诗赏析得分率92%
   
2. 中等层（60%/19人）：
   - 瓶颈领域：综合应用题失分率43%
   - 典型案例：张三（82分）开放题平均失分8.3

3. 困难层（22%/7人）：
   - 知识缺口：基础知识正确率仅62%
   - 高危表现：刘八（58分）阅读题错误率85%

**学科短板提示词：**
[简答题]
- 得分率：7.2/15分（平均）
- 错误结构：
  ▸ 要点缺失（40%：平均漏答2.3个采分点）
  ▸ 逻辑混乱（35%：因果倒置占18例）
  ▸ 格式违规（25%：未分点占63次）

[文言文]
- 高频错误：
  ▸ 虚词误译（"之"字错误率29%）
  ▸ 倒装句识别失败（占错误样本61%）
  ▸ 文化常识缺失（涉及12%失分）
`);

const input = ref(['tag1', 'tag2', 'tag3']);


</script>





<style scoped lang="scss">
.fp_container{
  width: 100%;
  padding: 30px;
}

.option-container{
  margin-top: 5%;
  display: flex;
  flex-direction: row;
  row-gap: 20px;
  column-gap: 5px;
  
}


</style>
