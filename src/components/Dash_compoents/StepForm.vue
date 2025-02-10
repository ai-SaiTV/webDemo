<template>
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
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  activeStep: Number,
  translateY: Number,
  form: Object,
  form1: Object,
  Mindimgsrc: String,
  isZoomed: Boolean,
  imageStyle: Object
});


const isHovering = ref(false);
const isGenerating = ref(false);


const toggleImageSize = () => {
  isZoomed.value = !isZoomed.value;
};


const onWheel = (event) => {
    if (event.deltaY > 0) {
        translateY.value = Math.min(translateY.value - 40, 0);
    } else {
        translateY.value = Math.max(translateY.value + 40, -500);
    }
};

const zoomedImageStyle = computed(() => ({
    transform: `translateY(${translateY.value}px)`,
    transition: 'transform 0.3s ease-in-out',
}));
</script>

<style scoped>
.step-form {
  margin-bottom: 20px;
}

.custom-textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.zoomed-image-container {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.zoomed-image {
  width: auto;
  height: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}
</style>