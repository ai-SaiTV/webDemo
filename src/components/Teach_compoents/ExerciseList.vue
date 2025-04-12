<script setup lang="ts">
import { Exercise } from '@/types';
import ExerciseCard from './ExerciseCard.vue';
// import AddResourceCard from './AddResourceCard.vue';

defineProps<{
  exercises: Exercise[];
}>();

const emit = defineEmits<{
  (e: 'openAddModal'): void;
  (e: 'openExerciseModal', exercise: Exercise): void;
  (e: 'deleteExercise', exercise: Exercise): void;
}>();
</script>

<template>
  <div class="Exercise-list">
    <!-- <AddResourceCard 
      title="新增课件" 
      description="点击添加新课件" 
      @click="emit('openAddModal')" 
    /> -->
    <ExerciseCard 
      v-for="exercise in exercises" 
      :key="exercise.id" 
      :exercise="exercise"
      @open-modal="emit('openExerciseModal', exercise)"
      @delete="emit('deleteExercise', exercise)"
    />
  </div>
</template>

<style scoped>
.Exercise-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>