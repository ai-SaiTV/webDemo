<script setup lang="ts">
import { Video } from '@/types';
import VideoCard from './VideoCard.vue';
import AddResourceCard from './AddResourceCard.vue';

defineProps<{
  videos: Video[];
}>();

const emit = defineEmits<{
  (e: 'openAddModal'): void;
  (e: 'openVideoModal', video: Video): void;
  (e: 'deleteVideo', video: Video): void;
}>();
</script>

<template>
  <div class="video-list">
    <AddResourceCard 
      title="新增视频" 
      description="点击添加新视频" 
      @click="emit('openAddModal')" 
    />
    <VideoCard 
      v-for="video in videos" 
      :key="video.id" 
      :video="video"
      @open-modal="emit('openVideoModal', video)"
      @delete="emit('deleteVideo', video)"
    />
  </div>
</template>

<style scoped>
.video-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>