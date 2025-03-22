<script setup lang="ts">
import { Text } from '@/types';
import TextCard from './TextCard.vue';
import AddResourceCard from './AddResourceCard.vue';

defineProps<{
  texts: Text[];
}>();

const emit = defineEmits<{
  (e: 'openAddModal'): void;
  (e: 'openTextModal', text: Text): void;
  (e: 'deleteText', text: Text): void;
}>();
</script>

<template>
  <div class="Text-list">
    <AddResourceCard 
      title="新增文本大纲" 
      description="点击添加新大纲" 
      @click="emit('openAddModal')" 
    />
    <TextCard 
      v-for="text in texts" 
      :key="text.id" 
      :text="text"
      @open-modal="emit('openTextModal', text)"
      @delete="emit('deleteText', text)"
    />
  </div>
</template>

<style scoped>
.Text-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>