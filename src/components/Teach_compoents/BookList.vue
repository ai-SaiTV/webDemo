<script setup lang="ts">
import { Book } from '@/types';
import BookCard from './BookCard.vue';
// import AddResourceCard from './AddResourceCard.vue';

defineProps<{
  books: Book[];
}>();

const emit = defineEmits<{
  (e: 'openAddModal'): void;
  (e: 'openBookModal', book: Book): void;
  (e: 'deleteBook', book: Book): void;
}>();
</script>

<template>
  <div class="book-list">
    <!-- <AddResourceCard 
      title="新增课件" 
      description="点击添加新课件" 
      @click="emit('openAddModal')" 
    /> -->
    <BookCard 
      v-for="book in books" 
      :key="book.id" 
      :book="book"
      @open-modal="emit('openBookModal', book)"
      @delete="emit('deleteBook', book)"
    />
  </div>
</template>

<style scoped>
.book-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>