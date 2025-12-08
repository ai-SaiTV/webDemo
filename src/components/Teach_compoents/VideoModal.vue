<script setup lang="ts">
import { ref } from 'vue';
import { Video } from '@/types';
import axios from 'axios';

const props =  defineProps<{
  video: Video;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'error'): void;
}>();

const isVideoVisible = ref(false);

const fetchAnalysis = () =>{
  axios.get('http://localhost:8080/teachingmaterials', {
    params: {
      videoId: props.video.path,
    },
  });
};
const toggleVideo = () => {
  isVideoVisible.value = !isVideoVisible.value;
  if (isVideoVisible.value) {
    window.open(props.video.path, '_blank');
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ video.title }}</h3>
      <p><strong>描述：</strong>{{ video.description || '暂无描述' }}</p>
      <button @click="toggleVideo">
        {{ isVideoVisible ? '关闭视频' : '视频预览' }}
      </button>
      <div v-if="isVideoVisible" class="video-container">
        <video 
          v-if="video.path" 
          :src="video.path" 
          controls 
          @click="fetchAnalysis"
          @error="emit('error')" 
          class="video-viewer"
        ></video>
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

.video-container {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 630px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-viewer {
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