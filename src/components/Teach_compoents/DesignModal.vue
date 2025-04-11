<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { Design } from '@/types';

const props = defineProps<{
  design: Design;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const iswordsVisible = ref(false);

const togglewords = () => {
  iswordsVisible.value = !iswordsVisible.value;
  if (iswordsVisible.value) {
    // Open the words in a new tab
    window.open(props.design.words, '_blank');
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ design.title }}</h3>
      <p><strong>描述：</strong>{{ design.description || '暂无描述' }}</p>
      <button v-if="design.words" @click="togglewords">
        {{ iswordsVisible ? '关闭课程设计' : '课程设计预览' }}
      </button>
      <div v-if="iswordsVisible" class="words-container">
        <iframe v-if="design.words" :src="design.words" class="words-viewer" frameborder="0"></iframe>
      </div>
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

.words-container {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 630px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.words-viewer {
  width: 100%;
  height: 100%;
  object-fit: contain;
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