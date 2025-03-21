<script setup lang="ts">
import { Video } from '@/types';

defineProps<{
  video: Video;
}>();

const emit = defineEmits<{
  (e: 'openModal', video: Video): void;
  (e: 'delete', video: Video): void;
}>();
</script>

<template>
  <div class="video-item" :data-id="video.id">
    <div class="video-header">
      <img :src="video.image || 'default.jpg'" :alt="video.title" />
      <h3>{{ video.title }}</h3>
      <p><strong>时长：</strong>{{ video.duration }}</p>
    </div>
    <button class="more-details" @click="emit('openModal', video)">更多详情</button>
    <button class="delete-button" @click="emit('delete', video)">删除</button>
  </div>
</template>

<style scoped>
.video-item {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  min-height: 470px;
  position: relative;
}

.video-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.video-header {
  background: linear-gradient(135deg, #a5c5ff 0%, #6200ff 100%);
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px 8px 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.video-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.video-header p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.more-details,
.delete-button {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.more-details {
  background: linear-gradient(145deg, #007BFF, #0056b3);
}

.more-details:hover {
  background: linear-gradient(145deg, #0056b3, #003d80);
  transform: scale(1.05);
}

.delete-button {
  background: linear-gradient(145deg, #FF3B30, #e60000);
}

.delete-button:hover {
  background: linear-gradient(145deg, #e60000, #cc0000);
}
</style>