<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { Text } from '@/types';
import mammoth from 'mammoth';

const props = defineProps<{
  text: Text;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'error'): void;
}>();

const isTextVisible = ref(false);
const docContent = ref<string>('');

const toggleText = () => {
  isTextVisible.value = !isTextVisible.value;
  console.log('Text visibility:', isTextVisible.value);
  if (isTextVisible.value && props.text.words) {
    const cleanedPath = props.text.words.replace(/^export default\s+/, '').replace(/^["'\s]+|["'\s]+$/g, '');
    fetchDocContent(cleanedPath);
    window.open(props.text.words, '_blank');
  }
};

const fetchDocContent = async (words: string) => {
  try {
    const response = await fetch(words);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    docContent.value = result.value;
  } catch (error) {
    emit('error');
    console.error('Error fetching or converting DOCX file:', error);
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ text.title }}</h3>
      <p><strong>描述：</strong>{{ text.description || '暂无描述' }}</p>
      <button @click="toggleText">
        {{ isTextVisible ? '关闭文本' : '文本预览' }}
      </button>
      <div v-if="isTextVisible" class="text-container" v-html="docContent"></div>
      <button @click="emit('close')">关闭</button>
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
  max-width: 1000px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  max-height: 100%;
}

.text-container {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 630px;
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  flex-direction: column;
}

button {
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>