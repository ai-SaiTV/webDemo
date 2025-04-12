<script setup lang="ts">
import type { Exercise } from '@/types/index';

defineProps<{
  exercise: Exercise;
}>();

const emit = defineEmits<{
  (e: 'openModal', exercise: Exercise): void;
  (e: 'delete', exercise: Exercise): void;
}>();
</script>

<template>
  <div class="Exercise-item" :data-id="exercise.id">
    <div class="Exercise-header">
      <h3>{{ exercise.title }}</h3>
      <p><strong>描述：</strong>{{ exercise.description || '暂无描述'}}</p>
    </div>
    <button class="more-details" @click="emit('openModal', exercise)">更多详情</button>
    <button class="delete-button" @click="emit('delete', exercise)">删除</button>
  </div>
</template>

<style scoped>
.Exercise-item {
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
  /* min-height: 470px; */
  position: relative;
}

.Exercise-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.Exercise-header {
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

.Exercise-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.Exercise-header p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.Exercise-header img {
  width: 100%;
  height: 370px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

</style>