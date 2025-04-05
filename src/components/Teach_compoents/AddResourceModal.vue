<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { NewBook, NewText, NewVideo } from '@/types';

const props = defineProps<{
  visible: boolean;
  type: 'book' | 'video'| 'text';
  modelValue: NewBook | NewVideo | NewText;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewBook | NewVideo | NewText): void;
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'fileUpload', event: Event, fileType: 'image' | 'pdf' | 'video'| 'text'): void;
}>();

const title = computed(() => props.type === 'book' ? '添加新课件' : props.type === 'video' ? '添加新视频' : '添加新文本');

const isBook = computed(() => props.type === 'book');
const isVideo = computed(() => props.type === 'video');
const isText = computed(() => props.type === 'text');
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleFileUpload = (event: Event, fileType: 'image' | 'pdf' | 'video' |'text') => {
  emit('fileUpload', event, fileType);
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <form @submit.prevent="emit('submit')">
        <div class="input-group">
          <label for="title">{{ isBook ? '课件名' : isVideo ? '视频标题' : '文本标题' }}：</label>
          <el-input 
            v-model="(formData as any).title" 
            :placeholder="isBook ? '请输入课件名' : isVideo ? '请输入视频标题' : '请输入文本标题'"
          />
        </div>
        
        <template v-if="isBook">
          <div class="input-group">
            <label for="author">作者：</label>
            <el-input 
              v-model="(formData as NewBook).author" 
              placeholder="请输入作者"
            />
          </div>
        </template>

        <template v-if="isText">
          <div class="input-group">
            <label for="words">文本路径：</label>
            <el-input 
              v-model="(formData as NewText).words" 
              placeholder="请输入文本路径"
            />
          </div>
        </template>
        <div class="input-group">
          <label for="description">描述：</label>
          <el-input
            type="textarea"
            v-model="(formData as any).description"
            :placeholder="isBook ? '请输入课件描述' : isVideo ? '请输入视频描述' : '请输入文本描述'"
          />
        </div>

        <div class="input-group">
          <label>{{ isBook ? '教材PDF' : isVideo ? '视频文件' : 'docx文件' }}：</label>
          <input 
            type="file" 
            @change="(e:any) => handleFileUpload(e, isBook ? 'pdf' : isVideo ? 'video' : 'text')" 
            :accept="isBook ? 'application/pdf' : isVideo ? 'video/*' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" 
          />
        </div>

        <div class="button-group">
          <button type="submit" class="submit-btn">提交</button>
          <button type="button" @click="emit('close')" class="cancel-btn">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e53935;
}
</style>