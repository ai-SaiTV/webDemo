<script setup lang="ts">
import { Design } from '@/types';
import DesignCard from './DesignCard.vue';
// import AddResourceCard from './AddResourceCard.vue';

defineProps<{
  designs: Design[];
}>();

const emit = defineEmits<{
  (e: 'openAddModal'): void;
  (e: 'openDesignModal', design: Design): void;
  (e: 'deleteDesign', design: Design): void;
}>();
</script>

<template>
  <div class="Design-list">
    <!-- <AddResourceCard 
      title="新增课件" 
      description="点击添加新课件" 
      @click="emit('openAddModal')" 
    /> -->
    <DesignCard 
      v-for="design in designs" 
      :key="design.id" 
      :design="design"
      @open-modal="emit('openDesignModal', design)"
      @delete="emit('deleteDesign', design)"
    />
  </div>
</template>

<style scoped>
.Design-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>