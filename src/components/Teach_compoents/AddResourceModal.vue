<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { NewBook, NewVideo } from '@/types';

const props = defineProps<{
  visible: boolean;
  type: 'book' | 'video';
  modelValue: NewBook | NewVideo;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewBook | NewVideo): void;
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'fileUpload', event: Event, fileType: 'image' | 'pdf' | 'video'): void;
}>();

const title = computed(() => props.type === 'book' ? '添加新教材' : '添加新视频');

const isBook = computed(() => props.type === 'book');
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleFileUpload = (event: Event, fileType: 'image' | 'pdf' | 'video') => {
  emit('fileUpload', event, fileType);
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <form @submit.prevent="emit('submit')">
        <div class="input-group">
          <label for="title">{{ isBook ? '书名' : '标题' }}：</label>
          <el-input 
            v-model="(formData as any).title" 
            :placeholder="isBook ? '请输入书名' : '请输入视频标题'"
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
          <div class="input-group">
            <label for="isbn">ISBN：</label>
            <el-input 
              v-model="(formData as NewBook).isbn" 
              placeholder="请输入ISBN"
            />
          </div>
          <div class="input-group">
            <label for="owner">所有者：</label>
            <el-input 
              v-model="(formData as NewBook).owner" 
              placeholder="请输入所有者"
            />
          </div>
        </template>

        <template v-else>
          <div class="input-group">
            <label for="duration">时长：</label>
            <el-input 
              v-model="(formData as NewVideo).duration" 
              placeholder="请输入视频时长"
            />
          </div>
        </template>

        <div class="input-group">
          <label for="description">描述：</label>
          <el-input
            type="textarea"
            v-model="(formData as any).description"
            :placeholder="isBook ? '请输入书籍描述' : '请输入视频描述'"
          />
        </div>

        <div class="input-group">
          <label for="image">封面图片：</label>
          <input 
            type="file" 
            @change="(e) => handleFileUpload(e, 'image')" 
            accept="image/*" 
          />
        </div>

        <div class="input-group">
          <label>{{ isBook ? '教材PDF' : '视频文件' }}：</label>
          <input 
            type="file" 
            @change="(e) => handleFileUpload(e, isBook ? 'pdf' : 'video')" 
            :accept="isBook ? 'application/pdf' : 'video/*'" 
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
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
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